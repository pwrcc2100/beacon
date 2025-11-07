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
    await supabaseAdmin
      .from('responses_v3')
      .delete()
      .eq('client_id', clientId)
      .in('source', ['demo_seed_balanced', 'demo_seed_with_departments', 'demo_seed']);

    await supabaseAdmin
      .from('employees')
      .delete()
      .eq('client_id', clientId)
      .ilike('email', 'demo-%@example.com');
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

      const participantCount = randInt(10, 22);
      participantsTotal += participantCount;
      const deptSummary = {
        name: `${divisionName} - ${departmentName}`,
        total: participantCount,
        teams: Object.fromEntries(teamIds.map(t => [t.teamName, 0])) as Record<string, number>,
      };

      for (let i = 0; i < participantCount; i++) {
        const teamEntry = teamIds[i % teamIds.length];
        deptSummary.teams[teamEntry.teamName] += 1;

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
          errors.push(`Employee creation failed (${deptKey}): ${empError.message}`);
          continue;
        }

        createdEmployeeIds.push(employeeId);

        const daysAgo = randInt(0, 180);
        const submittedAt = new Date(now.getTime() - daysAgo * 86400000);

        // Create varied score distributions by division, department, AND team:
        // This ensures "Which Teams Need Attention" shows a mix of red/orange/green
        let sentiment5, clarity5, workload5, safety5, leadership5;
        
        // Vary scores by team name to create diversity
        const teamName = teamEntry.teamName;
        
        if (divisionName === 'QLD') {
          // QLD: Mostly thriving, but Team E struggles
          if (teamName === 'Team E') {
            sentiment5 = randInt(2, 3);
            clarity5 = randInt(2, 3);
            workload5 = randInt(2, 3);
            safety5 = randInt(2, 3);
            leadership5 = randInt(2, 3);
          } else {
            sentiment5 = randInt(4, 5);
            clarity5 = randInt(4, 5);
            workload5 = randInt(4, 5);
            safety5 = randInt(4, 5);
            leadership5 = randInt(4, 5);
          }
        } else if (divisionName === 'Sydney Metro' && departmentName === 'Health') {
          // Sydney Metro Health: Thriving except Team D
          if (teamName === 'Team D') {
            sentiment5 = randInt(1, 2);
            clarity5 = randInt(1, 2);
            workload5 = randInt(1, 2);
            safety5 = randInt(1, 2);
            leadership5 = randInt(1, 2);
          } else {
            sentiment5 = randInt(4, 5);
            clarity5 = randInt(4, 5);
            workload5 = randInt(4, 5);
            safety5 = randInt(4, 5);
            leadership5 = randInt(4, 5);
          }
        } else if (divisionName === 'Sydney Metro') {
          // Other Sydney Metro departments: Mixed by team
          if (teamName === 'Team A') {
            sentiment5 = randInt(4, 5); // Thriving
            clarity5 = randInt(4, 5);
            workload5 = randInt(4, 5);
            safety5 = randInt(4, 5);
            leadership5 = randInt(4, 5);
          } else if (teamName === 'Team B' || teamName === 'Team C') {
            sentiment5 = randInt(3, 4); // Ones to watch
            clarity5 = randInt(3, 4);
            workload5 = randInt(3, 4);
            safety5 = randInt(3, 4);
            leadership5 = randInt(3, 4);
          } else {
            sentiment5 = randInt(2, 3); // Lower scores
            clarity5 = randInt(2, 3);
            workload5 = randInt(2, 3);
            safety5 = randInt(2, 3);
            leadership5 = randInt(2, 3);
          }
        } else {
          // Regional: Mostly lower scores with some variation
          if (teamName === 'Team A') {
            sentiment5 = randInt(3, 4); // One decent team
            clarity5 = randInt(3, 4);
            workload5 = randInt(3, 4);
            safety5 = randInt(3, 4);
            leadership5 = randInt(3, 4);
          } else if (teamName === 'Team E') {
            sentiment5 = randInt(1, 2); // Critical team
            clarity5 = randInt(1, 2);
            workload5 = randInt(1, 2);
            safety5 = randInt(1, 2);
            leadership5 = randInt(1, 2);
          } else {
            sentiment5 = randInt(2, 3); // Middle range
            clarity5 = randInt(2, 3);
            workload5 = randInt(2, 3);
            safety5 = randInt(2, 3);
            leadership5 = randInt(2, 3);
          }
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

  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < responses.length; i += batchSize) {
    const batch = responses.slice(i, i + batchSize);
    const { error, data } = await supabaseAdmin.from('responses_v3').insert(batch).select('id');
    if (error) {
      errors.push(`Response insert batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`);
    } else {
      inserted += data?.length ?? batch.length;
    }
  }

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

  return NextResponse.json({
    ok: true,
    inserted,
    verifiedResponses: verifiedResponses ?? 0,
    tokensCreated,
    tokenCount,
    participantsTotal,
    departments: departmentBreakdown,
    errors: errors.length ? errors : undefined,
  });
}


