import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Demo client ID - we'll use this for all demo responses
const DEMO_CLIENT_ID = '00000000-0000-0000-0000-000000000001';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Generate a unique employee ID for this demo session
    const demoEmployeeId = `demo-${uuidv4()}`;
    
    // Create demo employee record
    const { error: employeeError } = await supabaseAdmin
      .from('employees')
      .upsert({
        id: demoEmployeeId,
        client_id: DEMO_CLIENT_ID,
        first_name: 'Demo',
        last_name: 'User',
        email: `demo-${Date.now()}@beacon-demo.com`,
        mobile: '+61400000000',
        division_id: 'demo-division',
        status: 'active',
        created_at: new Date().toISOString()
      });

    if (employeeError) {
      console.error('Demo employee creation error:', employeeError);
    }

    // Store the survey response
    const { error: responseError } = await supabaseAdmin
      .from('responses')
      .insert({
        id: uuidv4(),
        client_id: DEMO_CLIENT_ID,
        employee_id: demoEmployeeId,
        token_id: body.token || 'demo-token',
        sentiment_3: body.sentiment_3,
        sentiment_5: body.sentiment_5,
        clarity_3: body.clarity_3,
        clarity_5: body.clarity_5,
        workload_3: body.workload_3,
        workload_5: body.workload_5,
        safety_3: body.safety_3,
        safety_5: body.safety_5,
        leadership_3: body.leadership_3,
        leadership_5: body.leadership_5,
        meta: {
          ...body.meta,
          demo_session: true,
          timestamp: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      });

    if (responseError) {
      console.error('Demo response error:', responseError);
      return NextResponse.json({ error: responseError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      employeeId: demoEmployeeId,
      message: 'Demo response recorded successfully!' 
    });

  } catch (error) {
    console.error('Demo API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all demo responses
    const { data: responses, error } = await supabaseAdmin
      .from('responses')
      .select('*')
      .eq('client_id', DEMO_CLIENT_ID)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching demo responses:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      responses: responses || [],
      count: responses?.length || 0
    });

  } catch (error) {
    console.error('Demo GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}