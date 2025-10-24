import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Delete the auth cookie
  cookies().delete('admin_auth');
  
  // Redirect to login page
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'));
}


