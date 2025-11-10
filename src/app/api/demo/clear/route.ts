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
    let employeesDeleted = 0;

    if (demoEmployeeIds.length > 0) {
      // Delete responses for demo employees
      const { error: responseDeleteError, count: respCount } = await supabaseAdmin
        .from('responses_v3')
        .delete({ count: 'exact' })
        .in('employee_id', demoEmployeeIds);

      if (responseDeleteError) {
        return NextResponse.json({ error: `Failed to delete responses: ${responseDeleteError.message}` }, { status: 500 });
      }

      responsesDeleted = respCount || 0;

      // Delete demo employees
      const { error: employeeDeleteError, count: empCount } = await supabaseAdmin
        .from('employees')
        .delete({ count: 'exact' })
        .in('employee_id', demoEmployeeIds);

      if (employeeDeleteError) {
        return NextResponse.json({ error: `Failed to delete employees: ${employeeDeleteError.message}` }, { status: 500 });
      }

      employeesDeleted = empCount || 0;
    }

    // Refresh materialized view
    await supabaseAdmin.rpc('refresh_wellbeing_responses');

    return NextResponse.json({
      ok: true,
      employeesDeleted,
      responsesDeleted,
      message: `Cleared ${employeesDeleted} demo employees and ${responsesDeleted} responses`,
    });
  } catch (error) {
    console.error('Clear demo data error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

