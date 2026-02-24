import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    // Allow either the configured admin password or known demo passwords
    const envPassword = process.env.ADMIN_PASSWORD;
    const allowedPasswords = new Set(
      [envPassword, 'Beacon2100!', 'beacon2025'].filter(Boolean)
    );
    
    if (allowedPasswords.has(password)) {
      cookies().set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}





