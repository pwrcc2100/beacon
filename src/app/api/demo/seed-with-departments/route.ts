import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

function randInt(min:number, max:number){
  return Math.floor(Math.random()*(max-min+1))+min;
}

// Demo hierarchy structure
const LOCATIONS = ['Sydney Metro', 'Regional', 'QLD'];
const SECTORS = ['Aged Care', 'Residential', 'Health', 'Education'];
const TEAMS = ['Team A', 'Team B', 'Team D'];
const PROJECTS = ['Project 1', 'Project 2', 'Project 3', 'Project 4'];

export async function POST(req: NextRequest){
  // Protect with admin token - check header first, then cookie
  const headerToken = req.headers.get('authorization')?.replace('Bearer ','') || '';
  const cookieToken = (await cookies()).get('dash')?.value || '';
  const token = headerToken || cookieToken;
  
  if (process.env.ADMIN_DASH_TOKEN && token !== process.env.ADMIN_DASH_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { client_id } = await req.json().catch(()=>({} as any));
  const clientId = client_id || process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID;
  if (!clientId) return NextResponse.json({ error: 'client_id required' }, { status: 400 });

  const now = new Date();
  const errors: string[] = [];
  
  // Create divisions (Locations)
  const divisionMap = new Map<string, string>();
  for (const location of LOCATIONS) {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('divisions')
      .select('division_id')
      .eq('client_id', clientId)
      .eq('division_name', location)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid errors when not found
    
    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 = not found, which is OK
      console.error(`Error checking existing division "${location}":`, existingError);
      errors.push(`Error checking division "${location}": ${existingError.message}`);
    }
    
    if (existing) {
      divisionMap.set(location, existing.division_id);
      console.log(`Using existing division "${location}": ${existing.division_id}`);
    } else {
      const { data: newDiv, error: insertError } = await supabaseAdmin
        .from('divisions')
        .insert({
          client_id: clientId,
          division_name: location,
          active: true
        })
        .select('division_id')
        .single();
      
      if (insertError) {
        console.error(`Error creating division "${location}":`, insertError);
        errors.push(`Error creating division "${location}": ${insertError.message}`);
      } else if (newDiv) {
        divisionMap.set(location, newDiv.division_id);
        console.log(`Created division "${location}": ${newDiv.division_id}`);
      } else {
        errors.push(`Failed to create division "${location}": No data returned`);
      }
    }
  }
  
  if (divisionMap.size === 0) {
    return NextResponse.json({ 
      error: 'Failed to create any divisions. Please check if the divisions table exists and has the correct schema.',
      divisionErrors: errors,
      hint: 'Run the database-schema-divisions-departments-teams-FIXED.sql migration in Supabase SQL Editor'
    }, { status: 500 });
  }

  // Create departments (Sectors) under each division
  const departmentMap = new Map<string, string>();
  for (const location of LOCATIONS) {
    const divisionId = divisionMap.get(location);
    if (!divisionId) {
      errors.push(`No division_id found for "${location}" - skipping departments`);
      continue;
    }
    
    for (const sector of SECTORS) {
      const deptName = `${location} - ${sector}`;
      const { data: existing, error: existingError } = await supabaseAdmin
        .from('departments')
        .select('department_id')
        .eq('division_id', divisionId)
        .eq('department_name', sector)
        .maybeSingle();
      
      if (existingError && existingError.code !== 'PGRST116') {
        console.error(`Error checking existing department "${deptName}":`, existingError);
        errors.push(`Error checking department "${deptName}": ${existingError.message}`);
      }
      
      if (existing) {
        departmentMap.set(`${location}:${sector}`, existing.department_id);
      } else {
        const { data: newDept, error: insertError } = await supabaseAdmin
          .from('departments')
          .insert({
            division_id: divisionId,
            department_name: sector,
            active: true
          })
          .select('department_id')
          .single();
        
        if (insertError) {
          console.error(`Error creating department "${deptName}":`, insertError);
          errors.push(`Error creating department "${deptName}": ${insertError.message}`);
        } else if (newDept) {
          departmentMap.set(`${location}:${sector}`, newDept.department_id);
        }
      }
    }
  }

  // Create teams (Projects) under departments
  const teamMap = new Map<string, string>();
  for (const location of LOCATIONS) {
    for (const sector of SECTORS) {
      const deptId = departmentMap.get(`${location}:${sector}`);
      if (!deptId) {
        errors.push(`No department_id found for "${location}:${sector}"`);
        continue;
      }
      
      for (const project of PROJECTS) {
        const teamName = `${location} - ${sector} - ${project}`;
        const { data: existing, error: existingError } = await supabaseAdmin
          .from('teams')
          .select('team_id')
          .eq('department_id', deptId)
          .eq('team_name', project)
          .maybeSingle();
        
        if (existingError && existingError.code !== 'PGRST116') {
          console.error(`Error checking existing team "${teamName}":`, existingError);
          errors.push(`Error checking team "${teamName}": ${existingError.message}`);
        }
        
        if (existing) {
          teamMap.set(`${location}:${sector}:${project}`, existing.team_id);
        } else {
          const { data: newTeam, error: insertError } = await supabaseAdmin
            .from('teams')
            .insert({
              department_id: deptId,
              team_name: project,
              active: true
            })
            .select('team_id')
            .single();
          
          if (insertError) {
            console.error(`Error creating team "${teamName}":`, insertError);
            errors.push(`Error creating team "${teamName}": ${insertError.message}`);
          } else if (newTeam) {
            teamMap.set(`${location}:${sector}:${project}`, newTeam.team_id);
          }
        }
      }
    }
  }

  // Create employees and responses (~100 total, distributed across hierarchy)
  const responses: any[] = [];
  const totalResponses = 100;
  const responsesPerDepartment = Math.floor(totalResponses / (LOCATIONS.length * SECTORS.length));
  let remainder = totalResponses % (LOCATIONS.length * SECTORS.length);

  let responseCount = 0;
  for (const location of LOCATIONS) {
    for (const sector of SECTORS) {
      const deptId = departmentMap.get(`${location}:${sector}`);
      if (!deptId) continue;
      
      // Get a team for this department
      const project = PROJECTS[randInt(0, PROJECTS.length - 1)];
      const teamId = teamMap.get(`${location}:${sector}:${project}`);
      if (!teamId) continue;
      
      const responsesForDept = responsesPerDepartment + (remainder > 0 ? 1 : 0);
      remainder--;
      
      for (let i = 0; i < responsesForDept && responseCount < totalResponses; i++) {
        // Create employee - use 'id' as primary key (employee_id is just for reference)
        const employeeId = crypto.randomUUID();
        const { error: empError } = await supabaseAdmin.from('employees').insert({
          id: employeeId,  // Use 'id' as primary key
          employee_id: employeeId,  // Keep as reference if needed
          client_id: clientId,
          division_id: divisionMap.get(location)!,
          department_id: deptId,
          team_id: teamId,
          active: true,
          first_name: `Employee`,
          last_name: `${responseCount + 1}`,
          email: `demo-${responseCount + 1}@example.com`
        });
        
        if (empError) {
          console.error('Employee insert error:', empError);
          // If employee creation fails, skip this response
          continue;
        }
        
        // Create response with random scores (distributed across time)
        const daysAgo = randInt(0, 180); // Spread over last 6 months
        const d = new Date(now.getTime() - daysAgo * 86400000);
        
        // Bias toward more positive responses (60% good, 30% okay, 10% struggling)
        const rand = Math.random();
        const s3 = rand < 0.6 ? 1 : rand < 0.9 ? 2 : 3;
        const c3 = Math.random() < 0.6 ? 1 : Math.random() < 0.9 ? 2 : 3;
        const w3 = Math.random() < 0.5 ? 1 : Math.random() < 0.85 ? 2 : 3;
        const sa3 = Math.random() < 0.65 ? 1 : Math.random() < 0.9 ? 2 : 3;
        const l3 = Math.random() < 0.6 ? 1 : Math.random() < 0.9 ? 2 : 3;
        
        const map = (v:number)=> v===1?5 : v===2?3 : 1;
        
        // Create token first (required foreign key)
        const tokenId = crypto.randomUUID();
        const validUntil = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year validity
        const { error: tokenError } = await supabaseAdmin.from('tokens').insert({
          id: tokenId,
          client_id: clientId,
          employee_id: employeeId,
          valid_until: validUntil.toISOString(),
          status: 'consumed', // Mark as consumed since this is demo data
          channel: 'web',
          consumed_at: d.toISOString()
        });
        
        if (tokenError) {
          console.error('Token creation error:', tokenError);
          continue; // Skip this response if token creation fails
        }
        
        responses.push({
          token_id: tokenId,
          client_id: clientId,
          employee_id: employeeId,  // This should match employees.id
          sentiment_3: s3, sentiment_5: map(s3),
          clarity_3: c3,   clarity_5: map(c3),
          workload_3: w3,  workload_5: map(w3),
          safety_3: sa3,   safety_5: map(sa3),
          leadership_3: l3, leadership_5: map(l3),
          comment_text: null,
          submitted_at: d.toISOString(),
          source: 'demo_seed_with_departments'
        });
        
        responseCount++;
      }
    }
  }

  // Insert responses in batches
  const batchSize = 20;
  let totalInserted = 0;
  const errors: string[] = [];
  
  for (let i = 0; i < responses.length; i += batchSize) {
    const batch = responses.slice(i, i + batchSize);
    const { error, data } = await supabaseAdmin.from('responses_v3').insert(batch).select();
    if (error) {
      console.error('Batch insert error:', error);
      errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`);
    } else {
      totalInserted += data?.length || batch.length;
    }
  }

  // Verify data was actually inserted
  const { count: responseCountInDb } = await supabaseAdmin
    .from('responses_v3')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('source', 'demo_seed_with_departments');
    
  // Check if employees were created with division_id
  const { count: employeesWithDivision } = await supabaseAdmin
    .from('employees')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .not('division_id', 'is', null);
  
  // Verify divisions were created
  const { count: divisionsCount } = await supabaseAdmin
    .from('divisions')
    .select('division_id', { count: 'exact', head: true })
    .eq('client_id', clientId);
  
  const { count: departmentsCount } = await supabaseAdmin
    .from('departments')
      .select('department_id', { count: 'exact', head: true })
    .in('division_id', Array.from(divisionMap.values()));
  
  const { count: teamsCount } = await supabaseAdmin
    .from('teams')
    .select('team_id', { count: 'exact', head: true })
    .in('department_id', Array.from(departmentMap.values()));

  return NextResponse.json({ 
    ok: true, 
    inserted: totalInserted,
    verifiedInDatabase: responseCountInDb || 0,
    employeesWithDivision: employeesWithDivision || 0,
    hierarchyCreated: {
      divisions: divisionsCount || 0,
      departments: departmentsCount || 0,
      teams: teamsCount || 0
    },
    errors: errors.length > 0 ? errors : undefined,
    structure: {
      divisions: LOCATIONS.length,
      departments: LOCATIONS.length * SECTORS.length,
      teams: LOCATIONS.length * SECTORS.length * PROJECTS.length,
      employees: responseCount
    }
  });
}

