import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

const DIVISIONS = ['Sydney Metro', 'Regional', 'QLD'];
const DEPARTMENTS = ['Aged Care', 'Residential', 'Health', 'Education'];
const TEAM_NAMES = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mapToThree(score5: number) {
  if (score5 >= 4) return 1; // thriving
  if (score5 >= 3) return 2; // watch
  return 3; // alert
}

// Extend timeout for this function (Vercel default is 10s)
export const maxDuration = 60; // 60 seconds
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const headerToken = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const cookieToken = (await cookies()).get('dash')?.value || '';
  const token = headerToken || cookieToken;

  if (process.env.ADMIN_DASH_TOKEN && token !== process.env.ADMIN_DASH_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({} as any));
  const clientId = body.client_id || process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID;
  const clearExisting = body.clear_existing ?? true;

  if (!clientId) {
    return NextResponse.json({ error: 'client_id required' }, { status: 400 });
  }

  if (clearExisting) {
    console.log('🧹 Clearing all old data including organizational hierarchy...');
    
    // Delete in proper order to handle foreign key constraints
    
    // 1. Delete responses with demo sources
    const { error: respDelError, count: respCount } = await supabaseAdmin
      .from('responses_v3')
      .delete({ count: 'exact' })
      .eq('client_id', clientId)
      .in('source', ['demo_seed_balanced', 'demo_seed_with_departments', 'demo_seed']);
    
    if (respDelError) {
      console.error('❌ Failed to delete old responses:', respDelError);
    } else {
      console.log(`✅ Deleted ${respCount || 0} old responses`);
    }

    // 2. Find demo employees to delete their tokens
    const { data: demoEmps } = await supabaseAdmin
      .from('employees')
      .select('employee_id')
      .eq('client_id', clientId)
      .ilike('email', 'demo-%@example.com');
    
    const demoEmployeeIds = (demoEmps || []).map(e => e.employee_id);
    console.log(`📋 Found ${demoEmployeeIds.length} demo employees to clean up`);
    
    if (demoEmployeeIds.length > 0) {
      // Delete tokens for demo employees
      const { error: tokenDelError, count: tokenCount } = await supabaseAdmin
        .from('tokens')
        .delete({ count: 'exact' })
        .in('employee_id', demoEmployeeIds);
      
      if (tokenDelError) {
        console.error('❌ Failed to delete old tokens:', tokenDelError);
      } else {
        console.log(`✅ Deleted ${tokenCount || 0} old tokens`);
      }
    }

    // 3. Delete employees
    const { error: empDelError, count: empCount } = await supabaseAdmin
      .from('employees')
      .delete({ count: 'exact' })
      .eq('client_id', clientId)
      .ilike('email', 'demo-%@example.com');
    
    if (empDelError) {
      console.error('❌ Failed to delete old employees:', empDelError);
    } else {
      console.log(`✅ Deleted ${empCount || 0} old employees`);
    }

    // 4. Now delete the organizational hierarchy (since all employees are gone)
    // Get all divisions for this client
    const { data: clientDivisions } = await supabaseAdmin
      .from('divisions')
      .select('division_id')
      .eq('client_id', clientId);
    
    const divisionIds = (clientDivisions || []).map(d => d.division_id);
    
    if (divisionIds.length > 0) {
      // Get all departments for these divisions
      const { data: clientDepartments } = await supabaseAdmin
        .from('departments')
        .select('department_id')
        .in('division_id', divisionIds);
      
      const departmentIds = (clientDepartments || []).map(d => d.department_id);
      
      if (departmentIds.length > 0) {
        // Delete teams first (they reference departments)
        const { error: teamDelError, count: teamCount } = await supabaseAdmin
          .from('teams')
          .delete({ count: 'exact' })
          .in('department_id', departmentIds);
        
        if (teamDelError) {
          console.error('❌ Failed to delete old teams:', teamDelError);
        } else {
          console.log(`✅ Deleted ${teamCount || 0} old teams`);
        }
      }

      // Delete departments (teams are gone)
      const { error: deptDelError, count: deptCount } = await supabaseAdmin
        .from('departments')
        .delete({ count: 'exact' })
        .in('division_id', divisionIds);
      
      if (deptDelError) {
        console.error('❌ Failed to delete old departments:', deptDelError);
      } else {
        console.log(`✅ Deleted ${deptCount || 0} old departments`);
      }
    }

    // Delete divisions (departments and teams are gone)
    const { error: divDelError, count: divCount } = await supabaseAdmin
      .from('divisions')
      .delete({ count: 'exact' })
      .eq('client_id', clientId);
    
    if (divDelError) {
      console.error('❌ Failed to delete old divisions:', divDelError);
    } else {
      console.log(`✅ Deleted ${divCount || 0} old divisions`);
    }
    
    console.log('🎯 All old data cleared! Starting fresh generation...');
  }

  const errors: string[] = [];
  const divisionMap = new Map<string, string>();

  for (const divisionName of DIVISIONS) {
    const { data: existing, error } = await supabaseAdmin
      .from('divisions')
      .select('division_id')
      .eq('client_id', clientId)
      .eq('division_name', divisionName)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      errors.push(`Division lookup failed for ${divisionName}: ${error.message}`);
      continue;
    }

    if (existing) {
      divisionMap.set(divisionName, existing.division_id);
    } else {
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('divisions')
        .insert({ client_id: clientId, division_name: divisionName, active: true })
        .select('division_id')
        .single();

      if (insertError || !inserted) {
        errors.push(`Create division failed for ${divisionName}: ${insertError?.message || 'no data returned'}`);
      } else {
        divisionMap.set(divisionName, inserted.division_id);
      }
    }
  }

  const departmentMap = new Map<string, string>();
  for (const divisionName of DIVISIONS) {
    const divisionId = divisionMap.get(divisionName);
    if (!divisionId) continue;

    for (const departmentName of DEPARTMENTS) {
      const key = `${divisionName}:${departmentName}`;
      const { data: existing, error } = await supabaseAdmin
        .from('departments')
        .select('department_id')
        .eq('division_id', divisionId)
        .eq('department_name', departmentName)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        errors.push(`Department lookup failed for ${key}: ${error.message}`);
        continue;
      }

      if (existing) {
        departmentMap.set(key, existing.department_id);
      } else {
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('departments')
          .insert({ division_id: divisionId, department_name: departmentName, active: true })
          .select('department_id')
          .single();

        if (insertError || !inserted) {
          errors.push(`Create department failed for ${key}: ${insertError?.message || 'no data returned'}`);
        } else {
          departmentMap.set(key, inserted.department_id);
        }
      }
    }
  }

  const teamMap = new Map<string, string>();
  for (const divisionName of DIVISIONS) {
    for (const departmentName of DEPARTMENTS) {
      const deptId = departmentMap.get(`${divisionName}:${departmentName}`);
      if (!deptId) continue;

      for (const teamName of TEAM_NAMES) {
        const key = `${divisionName}:${departmentName}:${teamName}`;
        const { data: existing, error } = await supabaseAdmin
          .from('teams')
          .select('team_id')
          .eq('department_id', deptId)
          .eq('team_name', teamName)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          errors.push(`Team lookup failed for ${key}: ${error.message}`);
          continue;
        }

        if (existing) {
          teamMap.set(key, existing.team_id);
        } else {
          const { data: inserted, error: insertError } = await supabaseAdmin
            .from('teams')
            .insert({ department_id: deptId, team_name: teamName, active: true })
            .select('team_id')
            .single();

          if (insertError || !inserted) {
            errors.push(`Create team failed for ${key}: ${insertError?.message || 'no data returned'}`);
          } else {
            teamMap.set(key, inserted.team_id);
          }
        }
      }
    }
  }

  // Re-fetch teams to ensure map populated after async operations
  for (const divisionName of DIVISIONS) {
    for (const departmentName of DEPARTMENTS) {
      const deptId = departmentMap.get(`${divisionName}:${departmentName}`);
      if (!deptId) continue;

      const { data: teams } = await supabaseAdmin
        .from('teams')
        .select('team_id, team_name')
        .eq('department_id', deptId)
        .order('team_name');

      teams?.forEach(team => {
        teamMap.set(`${divisionName}:${departmentName}:${team.team_name}`, team.team_id);
      });
    }
  }

  const now = new Date();
  const responses: any[] = [];
  const departmentBreakdown: Record<string, { name: string; total: number; teams: Record<string, number> }> = {};
  let participantsTotal = 0;
  let tokensCreated = 0;
  const createdEmployeeIds: string[] = [];

  for (const divisionName of DIVISIONS) {
    for (const departmentName of DEPARTMENTS) {
      const deptKey = `${divisionName}:${departmentName}`;
      const deptId = departmentMap.get(deptKey);
      if (!deptId) continue;

      const teamIds = TEAM_NAMES
        .map(teamName => ({ teamName, teamId: teamMap.get(`${divisionName}:${departmentName}:${teamName}`) }))
        .filter((entry): entry is { teamName: string; teamId: string } => Boolean(entry.teamId));

      if (teamIds.length === 0) {
        errors.push(`No teams found for ${deptKey}`);
        continue;
      }

      // Create more employees than participants to simulate realistic participation rate (~25%)
      const totalEmployees = randInt(40, 80);
      const participantCount = Math.floor(totalEmployees * 0.25); // 25% participation
      participantsTotal += participantCount;
      const deptSummary = {
        name: `${divisionName} - ${departmentName}`,
        total: participantCount,
        teams: Object.fromEntries(teamIds.map(t => [t.teamName, 0])) as Record<string, number>,
      };

      // Create all employees first
      const deptEmployeeIds: string[] = [];
      for (let i = 0; i < totalEmployees; i++) {
        const teamEntry = teamIds[i % teamIds.length];
        const employeeId = crypto.randomUUID();
        const email = `demo-balanced-${employeeId.slice(0, 8)}@example.com`;

        const { error: empError } = await supabaseAdmin.from('employees').insert({
          id: employeeId,
          employee_id: employeeId,
          client_id: clientId,
          division_id: divisionMap.get(divisionName)!,
          department_id: deptId,
          team_id: teamEntry.teamId,
          first_name: 'Demo',
          last_name: 'Balanced',
          email,
          active: true,
        });

        if (empError) {
          console.error(`❌ Employee creation failed (${deptKey}):`, empError);
          errors.push(`Employee creation failed (${deptKey}): ${empError.message}`);
          continue;
        }

        deptEmployeeIds.push(employeeId);
        createdEmployeeIds.push(employeeId);
      }

      console.log(`👥 Created ${deptEmployeeIds.length} employees for ${deptKey}, will create ${participantCount} responses`);
      if (deptEmployeeIds.length > 0) {
        console.log(`First employee ID in array: ${deptEmployeeIds[0]}`);
      }

      // Now create responses for only a subset (25%) of employees
      for (let i = 0; i < participantCount && i < deptEmployeeIds.length; i++) {
        const employeeId = deptEmployeeIds[i];
        
        if (i === 0) {
          console.log(`Creating first response with employee_id: ${employeeId}`);
        }
        
        const teamEntry = teamIds[i % teamIds.length];
        deptSummary.teams[teamEntry.teamName] += 1;

        const daysAgo = randInt(0, 180);
        const submittedAt = new Date(now.getTime() - daysAgo * 86400000);

        // Create varied score distributions:
        // - QLD divisions: High scores (thriving) - 4-5 range
        // - Sydney Metro: Mixed scores - some high, some medium
        // - Regional: Medium to low scores
        let sentiment5, clarity5, workload5, safety5, leadership5;
        
        if (divisionName === 'QLD') {
          // QLD: Thriving scores (70%+ = 4-5 on 5-point scale)
          sentiment5 = randInt(4, 5);
          clarity5 = randInt(4, 5);
          workload5 = randInt(4, 5);
          safety5 = randInt(4, 5);
          leadership5 = randInt(4, 5);
        } else if (divisionName === 'Sydney Metro' && departmentName === 'Health') {
          // Sydney Metro Health: Also thriving
          sentiment5 = randInt(4, 5);
          clarity5 = randInt(4, 5);
          workload5 = randInt(4, 5);
          safety5 = randInt(4, 5);
          leadership5 = randInt(4, 5);
        } else if (divisionName === 'Sydney Metro' && departmentName === 'Education') {
          // Sydney Metro Education: Critical - needs attention (1-2 range for RED)
          sentiment5 = randInt(1, 2);
          clarity5 = randInt(1, 2);
          workload5 = randInt(1, 2);
          safety5 = randInt(1, 2);
          leadership5 = randInt(1, 2);
        } else if (divisionName === 'Sydney Metro') {
          // Other Sydney Metro departments: Mixed (2-4 range for ORANGE)
          sentiment5 = randInt(2, 4);
          clarity5 = randInt(2, 4);
          workload5 = randInt(2, 4);
          safety5 = randInt(2, 4);
          leadership5 = randInt(2, 4);
        } else if (divisionName === 'Regional NSW') {
          // Regional NSW: Critical scores (1-2 range for RED)
          sentiment5 = randInt(1, 2);
          clarity5 = randInt(1, 2);
          workload5 = randInt(1, 2);
          safety5 = randInt(1, 2);
          leadership5 = randInt(1, 2);
        } else {
          // Other Regional: Lower scores (2-3 range for ORANGE)
          sentiment5 = randInt(2, 3);
          clarity5 = randInt(2, 3);
          workload5 = randInt(2, 3);
          safety5 = randInt(2, 3);
          leadership5 = randInt(2, 3);
        }

        const tokenId = crypto.randomUUID();
        const { error: tokenError } = await supabaseAdmin.from('tokens').insert({
          id: tokenId,
          client_id: clientId,
          employee_id: employeeId,
          status: 'consumed',
          channel: 'web',
          consumed_at: submittedAt.toISOString(),
          valid_until: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        });

        if (tokenError) {
          errors.push(`Token creation failed (${deptKey}): ${tokenError.message}`);
          continue;
        }

        tokensCreated += 1;

        responses.push({
          token_id: tokenId,
          client_id: clientId,
          employee_id: employeeId,
          sentiment_5: sentiment5,
          sentiment_3: mapToThree(sentiment5),
          clarity_5: clarity5,
          clarity_3: mapToThree(clarity5),
          workload_5: workload5,
          workload_3: mapToThree(workload5),
          safety_5: safety5,
          safety_3: mapToThree(safety5),
          leadership_5: leadership5,
          leadership_3: mapToThree(leadership5),
          submitted_at: submittedAt.toISOString(),
          comment_text: null,
          source: 'demo_seed_balanced',
        });
      }

      departmentBreakdown[deptKey] = deptSummary;
    }
  }

  console.log(`📝 About to insert ${responses.length} responses in batches...`);
  if (responses.length > 0) {
    console.log('First response to insert:', {
      employee_id: responses[0].employee_id,
      client_id: responses[0].client_id,
      source: responses[0].source
    });
  }
  
  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < responses.length; i += batchSize) {
    const batch = responses.slice(i, i + batchSize);
    const { error, data } = await supabaseAdmin.from('responses_v3').insert(batch).select('id, employee_id');
    if (error) {
      console.error(`❌ Response insert batch ${Math.floor(i / batchSize) + 1} failed:`, error);
      errors.push(`Response insert batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`);
    } else {
      inserted += data?.length ?? batch.length;
      if (i === 0 && data && data.length > 0) {
        console.log(`First response after insert - employee_id: ${data[0].employee_id}`);
      }
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${data?.length || batch.length} responses`);
    }
  }
  
  console.log(`📊 Total responses inserted: ${inserted}`);

  const { count: verifiedResponses } = await supabaseAdmin
    .from('responses_v3')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('source', 'demo_seed_balanced');

  const tokenCountQuery = createdEmployeeIds.length
    ? await supabaseAdmin
        .from('tokens')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .in('employee_id', createdEmployeeIds)
    : { count: 0 };

  const tokenCount = tokenCountQuery.count ?? 0;

  console.log(`🔍 Verifying data was created correctly...`);

  // Count all employees and responses for this client (simpler query)
  const { count: totalEmployees } = await supabaseAdmin
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .ilike('email', '%demo-balanced-%');

  const { count: employeesWithTeamsCount } = await supabaseAdmin
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .ilike('email', '%demo-balanced-%')
    .not('team_id', 'is', null);

  console.log(`Total employees: ${totalEmployees}, with teams: ${employeesWithTeamsCount}`);

  const { count: responsesWithEmployeeIds } = await supabaseAdmin
    .from('responses_v3')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('source', 'demo_seed_balanced')
    .not('employee_id', 'is', null);

  console.log(`Total responses with employee_id: ${responsesWithEmployeeIds}`);

  // Refresh materialized view to ensure data is visible
  await supabaseAdmin.rpc('refresh_wellbeing_responses');

  console.log('📊 Seed Balanced Summary:', {
    employeesCreated: totalEmployees ?? 0,
    employeesWithTeams: employeesWithTeamsCount ?? 0,
    responsesCreated: inserted,
    responsesWithEmployeeId: responsesWithEmployeeIds ?? 0,
  });

  return NextResponse.json({
    ok: true,
    inserted,
    verifiedResponses: verifiedResponses ?? 0,
    verifiedInDatabase: verifiedResponses ?? 0,
    tokensCreated,
    tokenCount,
    participantsTotal,
    structure: {
      divisions: DIVISIONS.length,
      departments: DIVISIONS.length * DEPARTMENTS.length,
      teams: DIVISIONS.length * DEPARTMENTS.length * TEAM_NAMES.length,
    },
    verification: {
      employeesCreated: employeesCreated ?? 0,
      employeesWithTeams: employeesWithTeams ?? 0,
      responsesWithEmployeeId: responsesWithEmployees ?? 0,
    },
    departments: departmentBreakdown,
    errors: errors.length ? errors : undefined,
  });
}


