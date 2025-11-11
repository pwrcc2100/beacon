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

    if (demoEmployeeIds.length > 0) {
      // Delete in proper order to handle foreign key constraints
      
      // 1. Delete responses first
      const { error: responseDeleteError, count: respCount } = await supabaseAdmin
        .from('responses_v3')
        .delete({ count: 'exact' })
        .in('employee_id', demoEmployeeIds);

      if (responseDeleteError) {
        console.error('Response delete error:', responseDeleteError);
        return NextResponse.json({ error: `Failed to delete responses: ${responseDeleteError.message}` }, { status: 500 });
      }

      responsesDeleted = respCount || 0;

      // 2. Delete tokens (they reference employee_id)
      const { error: tokenDeleteError, count: tokenCount } = await supabaseAdmin
        .from('tokens')
        .delete({ count: 'exact' })
        .in('employee_id', demoEmployeeIds);

      if (tokenDeleteError) {
        console.error('Token delete error:', tokenDeleteError);
        return NextResponse.json({ error: `Failed to delete tokens: ${tokenDeleteError.message}` }, { status: 500 });
      }

      tokensDeleted = tokenCount || 0;

      // 3. Finally delete employees
      const { error: employeeDeleteError, count: empCount } = await supabaseAdmin
        .from('employees')
        .delete({ count: 'exact' })
        .in('employee_id', demoEmployeeIds);

      if (employeeDeleteError) {
        console.error('Employee delete error:', employeeDeleteError);
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
      tokensDeleted,
      message: `Cleared ${employeesDeleted} demo employees, ${responsesDeleted} responses, and ${tokensDeleted} tokens`,
    });
  } catch (error) {
    console.error('Clear demo data error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

