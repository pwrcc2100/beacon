import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mapToThree(score5: number) {
  if (score5 >= 4) return 1; // thriving
  if (score5 >= 3) return 2; // watch
  return 3; // alert
}

/**
 * Generate 6 months of historical trend data for demonstration
 * Creates weekly data points showing a realistic trend pattern
 */
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

  // Get existing employees to use for historical data
  const { data: existingEmployees } = await supabaseAdmin
    .from('employees')
    .select('employee_id, team_id, department_id, division_id')
    .eq('client_id', clientId)
    .eq('active', true)
    .limit(50);

  if (!existingEmployees || existingEmployees.length === 0) {
    return NextResponse.json({ 
      error: 'No active employees found. Please create employees first using the "Generate Balanced Demo Records" action.' 
    }, { status: 400 });
  }

  // Check if historical trends already exist (optional - can be run multiple times)
  const { count: existingHistoricalCount } = await supabaseAdmin
    .from('responses_v3')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('source', 'demo_seed_historical_trends');

  if (existingHistoricalCount && existingHistoricalCount > 0) {
    console.log(`⚠️ Found ${existingHistoricalCount} existing historical trend responses. New data will be added.`);
  }

  const now = new Date();
  const responses: any[] = [];
  const errors: string[] = [];

  // Generate 6 months of weekly data (approximately 26 weeks)
  // Create a realistic trend: start higher, decline gradually, then recover slightly
  const weeksToGenerate = 26;
  
  // Create a clear trend pattern with distinct weekly scores
  // Make sure each week is clearly different from adjacent weeks
  const trendPattern: number[] = [];
  for (let i = 0; i < weeksToGenerate; i++) {
    let score: number;
    if (i < 8) {
      // Weeks 1-8: Gradual decline from 80 to 68 (1.5 points per week)
      score = 80 - (i * 1.5);
    } else if (i < 14) {
      // Weeks 9-14: Continued decline to 56 (2 points per week)
      score = 68 - ((i - 8) * 2);
    } else if (i < 20) {
      // Weeks 15-20: Stabilization around 56-58 (slight variation)
      score = 56 + (Math.sin((i - 14) * 0.7) * 1);
    } else {
      // Weeks 21-26: Gradual recovery to 72 (2 points per week)
      score = 58 + ((i - 20) * 2.33);
    }
    trendPattern.push(Math.round(score * 10) / 10); // Round to 1 decimal
  }

  console.log('📊 Trend pattern (first 5, middle 3, last 5):');
  console.log('  First 5:', trendPattern.slice(0, 5).map(s => s.toFixed(1)).join(', '));
  console.log('  Middle 3:', trendPattern.slice(12, 15).map(s => s.toFixed(1)).join(', '));
  console.log('  Last 5:', trendPattern.slice(-5).map(s => s.toFixed(1)).join(', '));

  // Generate responses for each week
  // Start from 26 weeks ago and work forward
  for (let weekIndex = 0; weekIndex < weeksToGenerate; weekIndex++) {
    // Calculate the Monday of the week (weeksToGenerate weeks ago, counting backwards)
    // Use UTC to match the dashboard's week grouping logic
    const targetDate = new Date(now);
    const daysAgo = (weeksToGenerate - weekIndex - 1) * 7;
    targetDate.setUTCDate(targetDate.getUTCDate() - daysAgo);
    
    // Set to Monday of that week using UTC (matching dashboardData.ts logic)
    const day = targetDate.getUTCDay() || 7; // Convert Sunday (0) to 7
    const monday = new Date(Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate() - (day - 1)
    ));
    
    // Use Monday as base, distribute responses Monday-Friday
    const weekStart = new Date(monday);
    weekStart.setUTCHours(9, 0, 0, 0); // 9 AM UTC on Monday

    const targetScore = trendPattern[weekIndex];
    
    // Calculate domain scores to achieve target composite score
    // Composite = (sentiment*0.25 + workload*0.25 + leadership*0.2 + safety*0.2 + clarity*0.1) * 20
    // So average score = targetScore / 20
    const avgScore = targetScore / 20;
    
    // Generate 25-35 responses per week to ensure good averaging and clear weekly patterns
    const responsesPerWeek = randInt(25, 35);
    
    if (weekIndex === 0 || weekIndex === Math.floor(weeksToGenerate / 2) || weekIndex === weeksToGenerate - 1) {
      console.log(`  Week ${weekIndex + 1}: Target score ${targetScore.toFixed(1)}, ${responsesPerWeek} responses, Monday: ${weekStart.toISOString().slice(0, 10)}`);
    }
    
    for (let i = 0; i < responsesPerWeek; i++) {
      const employee = existingEmployees[randInt(0, existingEmployees.length - 1)];
      if (!employee) continue;

      // Add controlled variation (±0.15) to ensure weekly average stays close to target
      const variation = () => (Math.random() - 0.5) * 0.3;
      
      // Calculate domain scores with slight variation but centered on target
      const sentiment5 = Math.max(1, Math.min(5, avgScore + variation()));
      const workload5 = Math.max(1, Math.min(5, avgScore + variation()));
      const safety5 = Math.max(1, Math.min(5, avgScore + variation()));
      const leadership5 = Math.max(1, Math.min(5, avgScore + variation()));
      const clarity5 = Math.max(1, Math.min(5, avgScore + variation()));

      // Distribute responses across the week (Monday to Friday)
      // Most responses come Tuesday-Thursday (more realistic)
      const dayWeights = [0.1, 0.2, 0.3, 0.3, 0.1]; // Mon, Tue, Wed, Thu, Fri
      const rand = Math.random();
      let dayOffset = 0;
      let cumulative = 0;
      for (let d = 0; d < 5; d++) {
        cumulative += dayWeights[d];
        if (rand < cumulative) {
          dayOffset = d;
          break;
        }
      }
      
      const submittedAt = new Date(weekStart);
      submittedAt.setUTCDate(submittedAt.getUTCDate() + dayOffset);
      submittedAt.setUTCHours(randInt(9, 17), randInt(0, 59), randInt(0, 59), randInt(0, 999));

      const tokenId = crypto.randomUUID();
      
      // Use actual 1-5 scale values (not decimals)
      const roundToScale = (val: number) => {
        const rounded = Math.round(val * 2) / 2; // Round to 0.5
        return Math.max(1, Math.min(5, rounded));
      };

      responses.push({
        token_id: tokenId,
        client_id: clientId,
        employee_id: employee.employee_id,
        sentiment_5: roundToScale(sentiment5),
        sentiment_3: mapToThree(sentiment5),
        clarity_5: roundToScale(clarity5),
        clarity_3: mapToThree(clarity5),
        workload_5: roundToScale(workload5),
        workload_3: mapToThree(workload5),
        safety_5: roundToScale(safety5),
        safety_3: mapToThree(safety5),
        leadership_5: roundToScale(leadership5),
        leadership_3: mapToThree(leadership5),
        submitted_at: submittedAt.toISOString(),
        comment_text: null,
        source: 'demo_seed_historical_trends',
      });
    }
  }

  console.log(`📝 Generating ${responses.length} historical responses across ${weeksToGenerate} weeks...`);

  // Insert in batches
  const batchSize = 50;
  let inserted = 0;
  for (let i = 0; i < responses.length; i += batchSize) {
    const batch = responses.slice(i, i + batchSize);
    const { error } = await supabaseAdmin.from('responses_v3').insert(batch);
    if (error) {
      console.error(`❌ Response insert batch ${Math.floor(i / batchSize) + 1} failed:`, error);
      errors.push(`Response insert batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`);
    } else {
      inserted += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} responses`);
    }
  }

  // Refresh materialized view
  console.log('🔄 Refreshing materialized view...');
  await supabaseAdmin.rpc('refresh_wellbeing_responses');

  const { count: totalHistoricalCount } = await supabaseAdmin
    .from('responses_v3')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId)
    .eq('source', 'demo_seed_historical_trends');

  // Verify weekly averages by querying the materialized view
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const { data: weeklyAverages } = await supabaseAdmin
    .from('wellbeing_responses')
    .select('wk, sentiment_avg, workload_avg, safety_avg, leadership_avg, clarity_avg')
    .eq('client_id', clientId)
    .gte('wk', sixMonthsAgo.toISOString())
    .order('wk', { ascending: true })
    .limit(30);

  const calculatedScores = weeklyAverages?.map(row => {
    const composite = (row.sentiment_avg * 0.25 + row.workload_avg * 0.25 + 
                      row.safety_avg * 0.20 + row.leadership_avg * 0.20 + 
                      row.clarity_avg * 0.10) * 20;
    return { week: row.wk, score: Math.round(composite * 10) / 10 };
  }) || [];

  console.log('📈 Sample weekly composite scores from database:');
  if (calculatedScores.length > 0) {
    console.log('  First 3:', calculatedScores.slice(0, 3).map(s => `${s.score}`).join(', '));
    console.log('  Last 3:', calculatedScores.slice(-3).map(s => `${s.score}`).join(', '));
  }

  return NextResponse.json({
    ok: true,
    inserted,
    verifiedInDatabase: totalHistoricalCount ?? 0,
    weeksGenerated: weeksToGenerate,
    responsesPerWeek: Math.round(responses.length / weeksToGenerate),
    trendPattern: {
      start: Math.round(trendPattern[0]),
      lowest: Math.round(Math.min(...trendPattern)),
      current: Math.round(trendPattern[trendPattern.length - 1]),
    },
    sampleWeeklyScores: calculatedScores.slice(0, 5).map(s => s.score),
    errors: errors.length ? errors : undefined,
  });
}
