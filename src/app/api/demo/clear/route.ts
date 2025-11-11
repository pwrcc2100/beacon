import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');

    if (!clientId) {
      return NextResponse.json({ error: 'client_id is required' }, { status: 400 });
    }

    // Find all demo employees (emails containing 'demo')
    const { data: demoEmployees, error: fetchError } = await supabaseAdmin
      .from('employees')
      .select('employee_id')
      .eq('client_id', clientId)
      .ilike('email', '%demo%');

    if (fetchError) {
      return NextResponse.json({ error: `Failed to fetch demo employees: ${fetchError.message}` }, { status: 500 });
    }

    const demoEmployeeIds = (demoEmployees || []).map(emp => emp.employee_id);

    let responsesDeleted = 0;
    let tokensDeleted = 0;
    let employeesDeleted = 0;

    const errors: string[] = [];

    // 1. Delete ALL responses with demo sources (broader approach)
    const { error: responseDeleteError, count: respCount } = await supabaseAdmin
      .from('responses_v3')
      .delete({ count: 'exact' })
      .eq('client_id', clientId)
      .in('source', ['demo_seed_balanced', 'demo_seed_with_departments', 'demo_seed']);

    if (responseDeleteError) {
      console.error('Response delete error:', responseDeleteError);
      errors.push(`Responses: ${responseDeleteError.message}`);
    } else {
      responsesDeleted = respCount || 0;
    }

    // 2. Delete ALL tokens for this client (broader approach)
    const { error: tokenDeleteError, count: tokenCount } = await supabaseAdmin
      .from('tokens')
      .delete({ count: 'exact' })
      .eq('client_id', clientId)
      .ilike('employee_id', '%'); // Only tokens with employee_id set

    if (tokenDeleteError) {
      console.error('Token delete error:', tokenDeleteError);
      errors.push(`Tokens: ${tokenDeleteError.message}`);
    } else {
      tokensDeleted = tokenCount || 0;
    }

    // 3. Delete demo employees
    if (demoEmployeeIds.length > 0) {
      const { error: employeeDeleteError, count: empCount } = await supabaseAdmin
        .from('employees')
        .delete({ count: 'exact' })
        .in('employee_id', demoEmployeeIds);

      if (employeeDeleteError) {
        console.error('Employee delete error:', employeeDeleteError);
        errors.push(`Employees: ${employeeDeleteError.message}`);
      } else {
        employeesDeleted = empCount || 0;
      }
    }

    // 4. Clear organizational hierarchy for this client
    const { data: clientDivisions } = await supabaseAdmin
      .from('divisions')
      .select('division_id')
      .eq('client_id', clientId);
    
    const divisionIds = (clientDivisions || []).map(d => d.division_id);
    let teamsDeleted = 0;
    let departmentsDeleted = 0;
    let divisionsDeleted = 0;
    
    if (divisionIds.length > 0) {
      const { data: clientDepartments } = await supabaseAdmin
        .from('departments')
        .select('department_id')
        .in('division_id', divisionIds);
      
      const departmentIds = (clientDepartments || []).map(d => d.department_id);
      
      if (departmentIds.length > 0) {
        const { error: teamErr, count: teamCount } = await supabaseAdmin
          .from('teams')
          .delete({ count: 'exact' })
          .in('department_id', departmentIds);
        
        if (teamErr) {
          console.error('Team delete error:', teamErr);
          errors.push(`Teams: ${teamErr.message}`);
        } else {
          teamsDeleted = teamCount || 0;
        }
      }
      
      const { error: deptErr, count: deptCount } = await supabaseAdmin
        .from('departments')
        .delete({ count: 'exact' })
        .in('division_id', divisionIds);
      
      if (deptErr) {
        console.error('Department delete error:', deptErr);
        errors.push(`Departments: ${deptErr.message}`);
      } else {
        departmentsDeleted = deptCount || 0;
      }
    }
    
    const { error: divErr, count: divCount } = await supabaseAdmin
      .from('divisions')
      .delete({ count: 'exact' })
      .eq('client_id', clientId);
    
    if (divErr) {
      console.error('Division delete error:', divErr);
      errors.push(`Divisions: ${divErr.message}`);
    } else {
      divisionsDeleted = divCount || 0;
    }

    // Refresh materialized view
    await supabaseAdmin.rpc('refresh_wellbeing_responses');

    const message = `Cleared ${responsesDeleted} responses, ${tokensDeleted} tokens, ${employeesDeleted} employees, ${teamsDeleted} teams, ${departmentsDeleted} departments, ${divisionsDeleted} divisions`;

    return NextResponse.json({
      ok: errors.length === 0,
      employeesDeleted,
      responsesDeleted,
      tokensDeleted,
      teamsDeleted,
      departmentsDeleted,
      divisionsDeleted,
      message,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Clear demo data error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

