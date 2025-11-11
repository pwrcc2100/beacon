import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json({ error: 'No client ID configured' }, { status: 400 });
  }

  // Check what data exists
  const { count: divisionsCount } = await supabaseAdmin
    .from('divisions')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId);

  const { count: departmentsCount } = await supabaseAdmin
    .from('departments')
    .select('*', { count: 'exact', head: true });

  const { count: teamsCount } = await supabaseAdmin
    .from('teams')
    .select('*', { count: 'exact', head: true });

  const { count: employeesCount } = await supabaseAdmin
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId);

  const { count: employeesWithTeamsCount } = await supabaseAdmin
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .not('team_id', 'is', null);

  const { count: responsesCount } = await supabaseAdmin
    .from('responses_v3')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId);

  const { count: responsesWithEmployeesCount } = await supabaseAdmin
    .from('responses_v3')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .not('employee_id', 'is', null);

  return NextResponse.json({
    clientId,
    hierarchy: {
      divisions: divisionsCount || 0,
      departments: departmentsCount || 0,
      teams: teamsCount || 0,
    },
    employees: {
      total: employeesCount || 0,
      withTeams: employeesWithTeamsCount || 0,
    },
    responses: {
      total: responsesCount || 0,
      withEmployeeId: responsesWithEmployeesCount || 0,
    },
    diagnosis: {
      hasHierarchy: (divisionsCount || 0) > 0 && (teamsCount || 0) > 0,
      hasEmployeesWithTeams: (employeesWithTeamsCount || 0) > 0,
      hasResponsesLinked: (responsesWithEmployeesCount || 0) > 0,
      readyForTeamData: (employeesWithTeamsCount || 0) > 0 && (responsesWithEmployeesCount || 0) > 0,
    },
    recommendation: (employeesWithTeamsCount || 0) === 0 
      ? 'Click "Generate Balanced Demo Records" to create teams and employees'
      : (responsesWithEmployeesCount || 0) === 0
      ? 'Employees exist but no survey responses linked to them'
      : 'Data looks good! Team chart should be visible'
  });
}

