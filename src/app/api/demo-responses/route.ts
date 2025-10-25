import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo (resets on server restart)
// In production, this would use a proper database
let demoResponses: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Generate a unique employee ID for this demo session
    const demoEmployeeId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the survey response
    const response = {
      id: demoEmployeeId,
      employee_id: demoEmployeeId,
      client_id: 'demo-client-2024',
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
    };

    // Store in memory
    demoResponses.push(response);

    return NextResponse.json({ 
      success: true, 
      employeeId: demoEmployeeId,
      response: response,
      message: 'Demo response recorded successfully!' 
    });

  } catch (error) {
    console.error('Demo API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true,
      responses: demoResponses || [],
      count: demoResponses?.length || 0
    });

  } catch (error) {
    console.error('Demo GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}