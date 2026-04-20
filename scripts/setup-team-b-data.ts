#!/usr/bin/env tsx
/**
 * Automated script to seed Team B with perfect demo data:
 * - Index score ~82%
 * - 6 weeks of historical trend data
 * - Proper team name display
 * 
 * Run with: npx tsx scripts/setup-team-b-data.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';
config({ path: resolve(process.cwd(), '.env.local') });

import { supabaseAdmin } from '../src/lib/supabase';
import { calculateWellbeingPercent } from '../src/components/dashboard/scoreTheme';

const CLIENT_ID = process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_ID || '036802fb-215b-4a54-9d6e-9826043a6645';

async function setupTeamBData() {
  console.log('🚀 Starting automated Team B data setup...\n');
  
  try {
    // Step 1: Find first Team B alphabetically
    console.log('🔍 Step 1: Finding first Team B...');
    const { data: teamsData } = await supabaseAdmin
      .from('teams')
      .select(`
        team_id,
        team_name,
        department_id,
        departments!inner(
          department_name,
          division_id,
          divisions!inner(client_id, division_name)
        )
      `)
      .eq('departments.divisions.client_id', CLIENT_ID)
      .eq('active', true)
      .order('team_name');
    
    const firstTeamB = teamsData?.find(t => t.team_name === 'Team B');
    
    if (!firstTeamB) {
      console.log('❌ No Team B found');
      return;
    }
    
    const dept = Array.isArray(firstTeamB.departments) ? firstTeamB.departments[0] : firstTeamB.departments;
    const division = dept ? (Array.isArray(dept.divisions) ? dept.divisions[0] : dept?.divisions) : undefined;
    
    const suffixParts: string[] = [];
    if (division?.division_name) suffixParts.push(division.division_name);
    if (dept?.department_name) suffixParts.push(dept.department_name);
    const displayName = suffixParts.length ? `${firstTeamB.team_name} · ${suffixParts.join(' / ')}` : firstTeamB.team_name;
    
    console.log(`✅ Found: ${displayName}`);
    console.log(`   Team ID: ${firstTeamB.team_id}\n`);
    
    // Step 2: Get employee
    console.log('👤 Step 2: Finding employee...');
    const { data: employees } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('client_id', CLIENT_ID)
      .eq('team_id', firstTeamB.team_id)
      .limit(1);
    
    if (!employees || employees.length === 0) {
      console.log('❌ No employees found for Team B');
      return;
    }
    
    const employeeId = employees[0].id;
    console.log(`✅ Using employee: ${employeeId}\n`);
    
    // Step 3: Clean old responses
    console.log('🧹 Step 3: Cleaning old demo responses...');
    await supabaseAdmin
      .from('responses_v3')
      .delete()
      .eq('employee_id', employeeId)
      .eq('source', 'demo_seed_team_history');
    console.log('✅ Cleaned\n');
    
    // Step 4: Create perfect dataset
    console.log('📊 Step 4: Creating 6 weeks of data...');
    const now = new Date();
    const responses = [];
    
    for (let week = 0; week < 6; week++) {
      const weekDate = new Date(now);
      weekDate.setDate(weekDate.getDate() - (week * 7));
      const day = weekDate.getDay() || 7;
      weekDate.setDate(weekDate.getDate() - (day - 1));
      weekDate.setHours(12, 0, 0, 0);
      
      let s, w, sa, l, c;
      let responsesPerWeek = 1;
      
      if (week === 0) { 
        s=4; w=4; sa=4; l=4; c=5; // 82% - most recent
        responsesPerWeek = 100; // Many responses to dominate average
      }
      else if (week === 1) { 
        s=4; w=4; sa=4; l=4; c=5; // 82%
        responsesPerWeek = 50;
      }
      else if (week === 2) { s=4; w=4; sa=4; l=4; c=4; responsesPerWeek = 1; } // 80%
      else if (week === 3) { s=4; w=4; sa=4; l=4; c=4; responsesPerWeek = 1; } // 80%
      else if (week === 4) { s=4; w=3; sa=4; l=4; c=4; responsesPerWeek = 1; } // 75%
      else { s=3; w=3; sa=4; l=4; c=4; responsesPerWeek = 1; } // 70% - oldest
      
      for (let i = 0; i < responsesPerWeek; i++) {
        const responseDate = new Date(weekDate);
        responseDate.setDate(responseDate.getDate() + (i % 7));
        responseDate.setHours(12 + (i % 12), (i * 5) % 60, 0, 0);
        
        responses.push({
          token_id: randomUUID(),
          client_id: CLIENT_ID,
          employee_id: employeeId,
          sentiment_5: s,
          sentiment_3: s >= 4 ? 1 : s >= 3 ? 2 : 3,
          workload_5: w,
          workload_3: w >= 4 ? 1 : w >= 3 ? 2 : 3,
          safety_5: sa,
          safety_3: sa >= 4 ? 1 : sa >= 3 ? 2 : 3,
          leadership_5: l,
          leadership_3: l >= 4 ? 1 : l >= 3 ? 2 : 3,
          clarity_5: c,
          clarity_3: c >= 4 ? 1 : c >= 3 ? 2 : 3,
          comment_text: null,
          submitted_at: responseDate.toISOString(),
          source: 'demo_seed_team_history',
        });
      }
    }
    
    // Insert in batches
    console.log(`   Inserting ${responses.length} responses...`);
    const batchSize = 50;
    for (let i = 0; i < responses.length; i += batchSize) {
      const batch = responses.slice(i, i + batchSize);
      await supabaseAdmin.from('responses_v3').insert(batch);
      if ((i + batchSize) % 50 === 0) {
        process.stdout.write('.');
      }
    }
    console.log('\n✅ Inserted all responses\n');
    
    // Step 5: Verify
    console.log('✅ Step 5: Verifying data...');
    const { data: verify } = await supabaseAdmin
      .from('responses_v3')
      .select('sentiment_5, workload_5, safety_5, leadership_5, clarity_5')
      .eq('employee_id', employeeId)
      .eq('source', 'demo_seed_team_history');
    
    const avg = {
      sentiment: verify!.reduce((sum, r) => sum + (r.sentiment_5 || 0), 0) / verify!.length,
      workload: verify!.reduce((sum, r) => sum + (r.workload_5 || 0), 0) / verify!.length,
      safety: verify!.reduce((sum, r) => sum + (r.safety_5 || 0), 0) / verify!.length,
      leadership: verify!.reduce((sum, r) => sum + (r.leadership_5 || 0), 0) / verify!.length,
      clarity: verify!.reduce((sum, r) => sum + (r.clarity_5 || 0), 0) / verify!.length,
    };
    
    const index = calculateWellbeingPercent(avg);
    
    // Check weekly buckets
    const { data: allResponses } = await supabaseAdmin
      .from('responses_v3')
      .select('submitted_at, sentiment_5, workload_5, safety_5, leadership_5, clarity_5')
      .eq('employee_id', employeeId)
      .eq('source', 'demo_seed_team_history')
      .order('submitted_at', { ascending: true });
    
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);
    sixWeeksAgo.setHours(0, 0, 0, 0);
    
    const weekly = new Map();
    allResponses?.forEach(r => {
      const d = new Date(r.submitted_at);
      if (d < sixWeeksAgo) return;
      const day = d.getUTCDay() || 7;
      const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - (day - 1)));
      const key = monday.toISOString().slice(0, 10);
      const bucket = weekly.get(key) || { count: 0, sentiment: 0, workload: 0, safety: 0, leadership: 0, clarity: 0 };
      bucket.count++;
      bucket.sentiment += r.sentiment_5 || 0;
      bucket.workload += r.workload_5 || 0;
      bucket.safety += r.safety_5 || 0;
      bucket.leadership += r.leadership_5 || 0;
      bucket.clarity += r.clarity_5 || 0;
      weekly.set(key, bucket);
    });
    
    const weeklyPoints = Array.from(weekly.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekStart, bucket]) => {
        const score = calculateWellbeingPercent({
          sentiment: bucket.sentiment / bucket.count,
          workload: bucket.workload / bucket.count,
          safety: bucket.safety / bucket.count,
          leadership: bucket.leadership / bucket.count,
          clarity: bucket.clarity / bucket.count,
        });
        return { week: weekStart, score: score?.toFixed(1) || '0' };
      })
      .slice(-6);
    
    console.log('\n✨ Setup Complete!\n');
    console.log('📊 Summary:');
    console.log(`   Team: ${displayName}`);
    console.log(`   Current Index: ${index?.toFixed(1)}%`);
    console.log(`   Total responses: ${verify!.length}`);
    console.log(`   Weekly trend points: ${weeklyPoints.length}`);
    console.log('\n📈 Trend data:');
    weeklyPoints.forEach((p, i) => {
      console.log(`   Week ${i+1}: ${p.week} = ${p.score}%`);
    });
    
    if (index && index >= 81 && index <= 83 && weeklyPoints.length === 6) {
      console.log('\n✅ Perfect! Refresh the Group Leader View page to see the data.');
    } else {
      console.log('\n⚠️  Data may need adjustment.');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

setupTeamBData().catch(console.error);
