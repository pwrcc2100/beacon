#!/usr/bin/env tsx
/**
 * Script to seed one team with 6 months of historical data showing Index score of 82
 * 
 * Usage: npx tsx scripts/seed-team-history.ts
 * Or: npm run seed-team-history (if added to package.json)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { supabaseAdmin } from '../src/lib/supabase';
import { calculateWellbeingPercent } from '../src/components/dashboard/scoreTheme';

const CLIENT_ID = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID || '036802fb-215b-4a54-9d6e-9826043a6645';

async function seedTeamHistory() {
  console.log('🌱 Seeding team with 6 months of historical data...\n');

  // Get or create a team
  let { data: teams } = await supabaseAdmin
    .from('teams')
    .select('team_id, team_name, department_id, departments!inner(division_id, divisions!inner(client_id))')
    .eq('departments.divisions.client_id', CLIENT_ID)
    .limit(1);

  let teamId: string;
  let teamName: string;

  if (!teams || teams.length === 0) {
    console.log('📋 No teams found. Creating a team...\n');
    
    // Create division
    const { data: division, error: divError } = await supabaseAdmin
      .from('divisions')
      .insert({
        client_id: CLIENT_ID,
        division_name: 'Demo Division',
        active: true
      })
      .select('division_id')
      .single();

    if (divError) {
      console.error(`❌ Failed to create division: ${divError.message}`);
      process.exit(1);
    }

    // Create department
    const { data: department, error: deptError } = await supabaseAdmin
      .from('departments')
      .insert({
        division_id: division.division_id,
        department_name: 'Demo Department',
        active: true
      })
      .select('department_id')
      .single();

    if (deptError) {
      console.error(`❌ Failed to create department: ${deptError.message}`);
      process.exit(1);
    }

    // Create team
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .insert({
        department_id: department.department_id,
        team_name: 'Demo Team',
        active: true
      })
      .select('team_id, team_name')
      .single();

    if (teamError || !team) {
      console.error(`❌ Failed to create team: ${teamError?.message || 'no data returned'}`);
      process.exit(1);
    }

    teamId = team.team_id;
    teamName = team.team_name;
    console.log(`✅ Created team: ${teamName} (${teamId})\n`);
  } else {
    teamId = teams[0].team_id;
    teamName = teams[0].team_name;
    console.log(`📋 Found team: ${teamName} (${teamId})\n`);
  }

  // Get or create an employee for this team
  let { data: employees } = await supabaseAdmin
    .from('employees')
    .select('id, employee_id, team_id')
    .eq('client_id', CLIENT_ID)
    .eq('team_id', teamId)
    .limit(1);

  let employeeId: string;
  
  if (!employees || employees.length === 0) {
    // Create a new employee for this team
    employeeId = crypto.randomUUID();
    const { error: empError } = await supabaseAdmin.from('employees').insert({
      id: employeeId,
      employee_id: employeeId,
      client_id: CLIENT_ID,
      team_id: teamId,
      active: true,
      first_name: 'Demo',
      last_name: 'Employee',
      email: `demo-team-history-${Date.now()}@example.com`
    });

    if (empError) {
      console.error(`❌ Failed to create employee: ${empError.message}`);
      process.exit(1);
    }
    console.log(`✅ Created employee: ${employeeId}\n`);
  } else {
    employeeId = employees[0].id;
    console.log(`✅ Using existing employee: ${employeeId}\n`);
  }

  // Target Index score: 82
  // Formula: (0.25*sentiment + 0.25*workload + 0.20*safety + 0.20*leadership + 0.10*clarity) * 20 = 82
  // So: 0.25*sentiment + 0.25*workload + 0.20*safety + 0.20*leadership + 0.10*clarity = 4.1
  // Base scores to achieve ~82 (using integers):
  // sentiment=4 (1.0), workload=4 (1.0), safety=4 (0.8), leadership=4 (0.8), clarity=5 (0.5) = 4.1 * 20 = 82
  const baseScores = {
    sentiment: 4.0,
    workload: 4.0,
    safety: 4.0,
    leadership: 4.0,
    clarity: 5.0,
  };

  // Generate 6 weeks of weekly data (to show in historical trend)
  const now = new Date();
  const responses: any[] = [];
  
  console.log('📊 Generating 6 weeks of data (within last 6 weeks)...');
  for (let week = 0; week < 6; week++) {
    // Calculate date for this week (going back in time, but within last 6 weeks)
    const weekDate = new Date(now);
    weekDate.setDate(weekDate.getDate() - (week * 7));
    // Set to Monday of that week
    const day = weekDate.getDay() || 7;
    weekDate.setDate(weekDate.getDate() - (day - 1));
    weekDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    
    // Add variation: start lower (~70), gradually improve to ~82
    // Use deterministic variation based on week number for consistent results
    // Since we round to integers, we need larger variations to show up
    // Week 0 is most recent (today), week 5 is oldest (5 weeks ago)
    let sentiment5, workload5, safety5, leadership5, clarity5;
    
    if (week === 0) {
      // Week 0 (most recent, this week): at target (~82 index)
      sentiment5 = 4;
      workload5 = 4;
      safety5 = 4;
      leadership5 = 4;
      clarity5 = 5;
    } else if (week === 1) {
      // Week 1 (1 week ago): at target (~82 index)
      sentiment5 = 4;
      workload5 = 4;
      safety5 = 4;
      leadership5 = 4;
      clarity5 = 5;
    } else if (week === 2) {
      // Week 2 (2 weeks ago): approaching target (~80 index)
      sentiment5 = 4;
      workload5 = 4;
      safety5 = 4;
      leadership5 = 4;
      clarity5 = 4;
    } else if (week === 3) {
      // Week 3 (3 weeks ago): more improvement (~78 index)
      sentiment5 = 4;
      workload5 = 4;
      safety5 = 4;
      leadership5 = 4;
      clarity5 = 4;
    } else if (week === 4) {
      // Week 4 (4 weeks ago): improving (~75 index)
      sentiment5 = 4;
      workload5 = 3;
      safety5 = 4;
      leadership5 = 4;
      clarity5 = 4;
    } else {
      // Week 5 (oldest, 5 weeks ago): lower scores (~70 index)
      sentiment5 = 3;
      workload5 = 3;
      safety5 = 4;
      leadership5 = 4;
      clarity5 = 4;
    }

    // Map to 3-point scale
    const mapToThree = (score5: number) => {
      if (score5 >= 4) return 1; // thriving
      if (score5 >= 3) return 2; // watch
      return 3; // alert
    };

    // Create token for this response
    const tokenId = crypto.randomUUID();
    const validUntil = new Date(weekDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    // Insert token (may fail if duplicate, but that's ok - we'll ignore errors)
    try {
      await supabaseAdmin.from('tokens').insert({
        id: tokenId,
        client_id: CLIENT_ID,
        employee_id: employeeId,
        valid_until: validUntil.toISOString(),
        status: 'consumed',
        channel: 'web',
        consumed_at: weekDate.toISOString()
      });
    } catch (e) {
      // Ignore token insertion errors
    }

    responses.push({
      token_id: tokenId,
      client_id: CLIENT_ID,
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

  console.log('💾 Inserting responses...\n');
  for (let i = 0; i < responses.length; i += batchSize) {
    const batch = responses.slice(i, i + batchSize);
    const { error } = await supabaseAdmin.from('responses_v3').insert(batch);
    
    if (error) {
      errors.push(`Batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`);
      console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`);
    } else {
      inserted += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} responses`);
    }
  }

  // Calculate final average score (using base scores as they represent the average)
  const finalScores = {
    sentiment: baseScores.sentiment,
    workload: baseScores.workload,
    safety: baseScores.safety,
    leadership: baseScores.leadership,
    clarity: baseScores.clarity,
  };
  const finalIndex = calculateWellbeingPercent(finalScores);

  console.log('\n✨ Seeding complete!\n');
  console.log(`Team: ${teamName}`);
  console.log(`Employee ID: ${employeeId}`);
  console.log(`Responses inserted: ${inserted}`);
  console.log(`Target Index: 82`);
  console.log(`Final Index: ${finalIndex?.toFixed(1)}`);
  console.log(`Domain scores:`);
  console.log(`  - Sentiment: ${finalScores.sentiment.toFixed(1)}`);
  console.log(`  - Workload: ${finalScores.workload.toFixed(1)}`);
  console.log(`  - Safety: ${finalScores.safety.toFixed(1)}`);
  console.log(`  - Leadership: ${finalScores.leadership.toFixed(1)}`);
  console.log(`  - Clarity: ${finalScores.clarity.toFixed(1)}`);
  console.log(`Weeks of data: 6\n`);

  if (errors.length > 0) {
    console.error('⚠️  Errors occurred:');
    errors.forEach(e => console.error(`  - ${e}`));
  }
}

seedTeamHistory().catch(console.error);
