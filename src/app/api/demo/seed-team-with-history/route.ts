import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateWellbeingPercent } from '@/components/dashboard/scoreTheme';

export async function POST(req: NextRequest) {
  const headerToken = req.headers.get('authorization')?.replace('Bearer ', '') || '';
  const cookieToken = (await cookies()).get('dash')?.value || '';
  const token = headerToken || cookieToken;

  if (process.env.ADMIN_DASH_TOKEN && token !== process.env.ADMIN_DASH_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({} as any));
  const clientId = body.client_id || process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json({ error: 'client_id required' }, { status: 400 });
  }

  // Get the first team from the database
  const { data: teams, error: teamsError } = await supabaseAdmin
    .from('teams')
    .select('team_id, team_name')
    .eq('client_id', clientId)
    .limit(1);

  if (teamsError || !teams || teams.length === 0) {
    return NextResponse.json({ error: 'No teams found. Please seed teams first.' }, { status: 400 });
  }

  const teamId = teams[0].team_id;
  const teamName = teams[0].team_name;

  // Get or create an employee for this team
  let { data: employees } = await supabaseAdmin
    .from('employees')
    .select('id, employee_id, team_id')
    .eq('client_id', clientId)
    .eq('team_id', teamId)
    .limit(1);

  let employeeId: string;
  
  if (!employees || employees.length === 0) {
    // Create a new employee for this team
    employeeId = crypto.randomUUID();
    const { error: empError } = await supabaseAdmin.from('employees').insert({
      id: employeeId,
      employee_id: employeeId,
      client_id: clientId,
      team_id: teamId,
      active: true,
      first_name: 'Demo',
      last_name: 'Employee',
      email: `demo-team-history-${Date.now()}@example.com`
    });

    if (empError) {
      return NextResponse.json({ error: `Failed to create employee: ${empError.message}` }, { status: 500 });
    }
  } else {
    employeeId = employees[0].id;
  }

  // Target Index score: 82
  // Formula: (0.25*sentiment + 0.25*workload + 0.20*safety + 0.20*leadership + 0.10*clarity) * 20 = 82
  // So: 0.25*sentiment + 0.25*workload + 0.20*safety + 0.20*leadership + 0.10*clarity = 4.1
  
  // Base scores to achieve ~82:
  // sentiment = 4.2 (0.25 * 4.2 = 1.05)
  // workload = 4.0 (0.25 * 4.0 = 1.00)
  // safety = 4.1 (0.20 * 4.1 = 0.82)
  // leadership = 4.0 (0.20 * 4.0 = 0.80)
  // clarity = 4.2 (0.10 * 4.2 = 0.42)
  // Total = 4.09 * 20 = 81.8 ≈ 82

  const baseScores = {
    sentiment: 4.2,
    workload: 4.0,
    safety: 4.1,
    leadership: 4.0,
    clarity: 4.2,
  };

  // Generate 6 months of weekly data (26 weeks)
  const now = new Date();
  const responses: any[] = [];
  
  for (let week = 0; week < 26; week++) {
    // Calculate date for this week (going back in time)
    const weekDate = new Date(now);
    weekDate.setDate(weekDate.getDate() - (week * 7));
    
    // Add some variation: start lower (~75), gradually improve to ~82, then stabilize
    let variation = 0;
    if (week < 8) {
      // First 8 weeks: gradually improving from ~75 to ~82
      variation = -0.35 + (week / 8) * 0.35; // -0.35 to 0
    } else if (week < 18) {
      // Weeks 8-18: stable around 82
      variation = (Math.random() - 0.5) * 0.15; // -0.075 to +0.075
    } else {
      // Last 8 weeks: slight improvement to ~84
      variation = 0.1 + (Math.random() - 0.5) * 0.1; // 0.05 to 0.15
    }

    // Apply variation to each domain with slight randomness
    const sentiment = Math.max(1, Math.min(5, baseScores.sentiment + variation + (Math.random() - 0.5) * 0.2));
    const workload = Math.max(1, Math.min(5, baseScores.workload + variation + (Math.random() - 0.5) * 0.2));
    const safety = Math.max(1, Math.min(5, baseScores.safety + variation + (Math.random() - 0.5) * 0.2));
    const leadership = Math.max(1, Math.min(5, baseScores.leadership + variation + (Math.random() - 0.5) * 0.2));
    const clarity = Math.max(1, Math.min(5, baseScores.clarity + variation + (Math.random() - 0.5) * 0.2));

    // Round to 1 decimal place
    const sentiment5 = Math.round(sentiment * 10) / 10;
    const workload5 = Math.round(workload * 10) / 10;
    const safety5 = Math.round(safety * 10) / 10;
    const leadership5 = Math.round(leadership * 10) / 10;
    const clarity5 = Math.round(clarity * 10) / 10;

    // Calculate Index to verify
    const index = calculateWellbeingPercent({
      sentiment: sentiment5,
      workload: workload5,
      safety: safety5,
      leadership: leadership5,
      clarity: clarity5,
    });

    // Map to 3-point scale
    const mapToThree = (score5: number) => {
      if (score5 >= 4) return 1; // thriving
      if (score5 >= 3) return 2; // watch
      return 3; // alert
    };

    // Create token for this response
    const tokenId = crypto.randomUUID();
    const validUntil = new Date(weekDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    // Insert token (may fail if duplicate, but that's ok)
    await supabaseAdmin.from('tokens').insert({
      id: tokenId,
      client_id: clientId,
      employee_id: employeeId,
      valid_until: validUntil.toISOString(),
      status: 'consumed',
      channel: 'web',
      consumed_at: weekDate.toISOString()
    });

    responses.push({
      token_id: tokenId,
      client_id: clientId,
      employee_id: employeeId,
      sentiment_5: sentiment5,
      sentiment_3: mapToThree(sentiment5),
      workload_5: workload5,
      workload_3: mapToThree(workload5),
      safety_5: safety5,
      safety_3: mapToThree(safety5),
      leadership_5: leadership5,
      leadership_3: mapToThree(leadership5),
      clarity_5: clarity5,
      clarity_3: mapToThree(clarity5),
      comment_text: null,
      submitted_at: weekDate.toISOString(),
      source: 'demo_seed_team_history',
    });
  }

  // Insert responses in batches
  const batchSize = 50;
  let inserted = 0;
  const errors: string[] = [];

  for (let i = 0; i < responses.length; i += batchSize) {
    const batch = responses.slice(i, i + batchSize);
    const { error } = await supabaseAdmin.from('responses_v3').insert(batch);
    
    if (error) {
      errors.push(`Batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }

  // Calculate final average score
  const finalScores = {
    sentiment: baseScores.sentiment + 0.1,
    workload: baseScores.workload + 0.1,
    safety: baseScores.safety + 0.1,
    leadership: baseScores.leadership + 0.1,
    clarity: baseScores.clarity + 0.1,
  };
  const finalIndex = calculateWellbeingPercent(finalScores);

  return NextResponse.json({
    success: true,
    team_id: teamId,
    team_name: teamName,
    employee_id: employeeId,
    inserted,
    errors: errors.length > 0 ? errors : undefined,
    target_index: 82,
    final_index: finalIndex?.toFixed(1),
    domain_scores: {
      sentiment: finalScores.sentiment.toFixed(1),
      workload: finalScores.workload.toFixed(1),
      safety: finalScores.safety.toFixed(1),
      leadership: finalScores.leadership.toFixed(1),
      clarity: finalScores.clarity.toFixed(1),
    },
    weeks_of_data: 26,
  });
}
