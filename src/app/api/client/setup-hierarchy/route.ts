import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * API endpoint to setup organizational hierarchy for a client
 * 
 * This endpoint:
 * 1. Verifies the hierarchy tables exist (creates if needed)
 * 2. Creates divisions, departments, and teams based on provided config
 * 3. Returns status and any errors
 * 
 * Usage:
 * POST /api/client/setup-hierarchy
 * Body: {
 *   client_id: "uuid",
 *   hierarchy: {
 *     divisions: ["Division 1", "Division 2"],
 *     departments_per_division: ["Dept A", "Dept B"],
 *     teams_per_department: ["Team 1", "Team 2"]
 *   }
 * }
 */
export async function POST(req: NextRequest) {
  // Protect with admin token
  const headerToken = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const cookieToken = (await cookies()).get('dash')?.value || '';
  const token = headerToken || cookieToken;
  
  if (process.env.ADMIN_DASH_TOKEN && token !== process.env.ADMIN_DASH_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { client_id, hierarchy } = await req.json();
    const clientId = client_id || process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID;
    
    if (!clientId) {
      return NextResponse.json({ error: 'client_id required' }, { status: 400 });
    }

    if (!hierarchy || !hierarchy.divisions || !hierarchy.departments_per_division || !hierarchy.teams_per_department) {
      return NextResponse.json({ 
        error: 'Invalid hierarchy structure. Required: divisions, departments_per_division, teams_per_department' 
      }, { status: 400 });
    }

    const errors: string[] = [];
    const results = {
      divisions: [] as string[],
      departments: [] as string[],
      teams: [] as string[],
    };

    // Step 1: Verify tables exist (they should, but check anyway)
    const { error: divisionsCheck } = await supabaseAdmin
      .from('divisions')
      .select('division_id')
      .limit(1);

    if (divisionsCheck && divisionsCheck.code === '42P01') {
      // Table doesn't exist - this shouldn't happen if migration was run
      return NextResponse.json({ 
        error: 'Hierarchy tables do not exist. Please run database-schema-hierarchy-template.sql migration first.',
        hint: 'Go to Supabase SQL Editor and run the migration script'
      }, { status: 500 });
    }

    // Step 2: Create divisions
    const divisionMap = new Map<string, string>();
    for (const divisionName of hierarchy.divisions) {
      const { data: existing, error: existingError } = await supabaseAdmin
        .from('divisions')
        .select('division_id')
        .eq('client_id', clientId)
        .eq('division_name', divisionName)
        .maybeSingle();

      if (existingError && existingError.code !== 'PGRST116') {
        errors.push(`Error checking division "${divisionName}": ${existingError.message}`);
        continue;
      }

      if (existing) {
        divisionMap.set(divisionName, existing.division_id);
        results.divisions.push(`Using existing: ${divisionName}`);
      } else {
        const { data: newDiv, error: insertError } = await supabaseAdmin
          .from('divisions')
          .insert({
            client_id: clientId,
            division_name: divisionName,
            active: true
          })
          .select('division_id')
          .single();

        if (insertError) {
          errors.push(`Error creating division "${divisionName}": ${insertError.message}`);
        } else if (newDiv) {
          divisionMap.set(divisionName, newDiv.division_id);
          results.divisions.push(`Created: ${divisionName}`);
        }
      }
    }

    if (divisionMap.size === 0) {
      return NextResponse.json({ 
        error: 'Failed to create any divisions',
        errors 
      }, { status: 500 });
    }

    // Step 3: Create departments under each division
    const departmentMap = new Map<string, string>();
    for (const [divisionName, divisionId] of divisionMap) {
      for (const deptName of hierarchy.departments_per_division) {
        const key = `${divisionName}:${deptName}`;
        const { data: existing, error: existingError } = await supabaseAdmin
          .from('departments')
          .select('department_id')
          .eq('division_id', divisionId)
          .eq('department_name', deptName)
          .maybeSingle();

        if (existingError && existingError.code !== 'PGRST116') {
          errors.push(`Error checking department "${key}": ${existingError.message}`);
          continue;
        }

        if (existing) {
          departmentMap.set(key, existing.department_id);
          results.departments.push(`Using existing: ${key}`);
        } else {
          const { data: newDept, error: insertError } = await supabaseAdmin
            .from('departments')
            .insert({
              division_id: divisionId,
              department_name: deptName,
              active: true
            })
            .select('department_id')
            .single();

          if (insertError) {
            errors.push(`Error creating department "${key}": ${insertError.message}`);
          } else if (newDept) {
            departmentMap.set(key, newDept.department_id);
            results.departments.push(`Created: ${key}`);
          }
        }
      }
    }

    // Step 4: Create teams under each department
    for (const [deptKey, deptId] of departmentMap) {
      for (const teamName of hierarchy.teams_per_department) {
        const key = `${deptKey}:${teamName}`;
        const { data: existing, error: existingError } = await supabaseAdmin
          .from('teams')
          .select('team_id')
          .eq('department_id', deptId)
          .eq('team_name', teamName)
          .maybeSingle();

        if (existingError && existingError.code !== 'PGRST116') {
          errors.push(`Error checking team "${key}": ${existingError.message}`);
          continue;
        }

        if (existing) {
          results.teams.push(`Using existing: ${key}`);
        } else {
          const { data: newTeam, error: insertError } = await supabaseAdmin
            .from('teams')
            .insert({
              department_id: deptId,
              team_name: teamName,
              active: true
            })
            .select('team_id')
            .single();

          if (insertError) {
            errors.push(`Error creating team "${key}": ${insertError.message}`);
          } else if (newTeam) {
            results.teams.push(`Created: ${key}`);
          }
        }
      }
    }

    // Step 5: Verify what was created
    const { count: divisionsCount } = await supabaseAdmin
      .from('divisions')
      .select('division_id', { count: 'exact', head: true })
      .eq('client_id', clientId);

    const { count: departmentsCount } = await supabaseAdmin
      .from('departments')
      .select('department_id', { count: 'exact', head: true })
      .in('division_id', Array.from(divisionMap.values()));

    const divisionIds = Array.from(divisionMap.values());
    const { data: departments } = await supabaseAdmin
      .from('departments')
      .select('department_id')
      .in('division_id', divisionIds);

    const departmentIds = departments?.map(d => d.department_id) || [];
    const { count: teamsCount } = await supabaseAdmin
      .from('teams')
      .select('team_id', { count: 'exact', head: true })
      .in('department_id', departmentIds);

    return NextResponse.json({
      ok: true,
      message: 'Hierarchy setup completed',
      summary: {
        divisions: divisionsCount || 0,
        departments: departmentsCount || 0,
        teams: teamsCount || 0
      },
      results: {
        divisions: results.divisions,
        departments: results.departments.slice(0, 10), // Limit to first 10
        teams: results.teams.slice(0, 10) // Limit to first 10
      },
      errors: errors.length > 0 ? errors : undefined,
      note: errors.length > 0 ? 'Some items may have failed. Check errors array.' : suggestedStructureReady()
    });

  } catch (error: any) {
    console.error('Hierarchy setup error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

function suggestedStructureReady() {
  return 'Hierarchy structure is ready. You can now generate demo data or import employees.';
}

