import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get('password') || '');
  const redirect = String(form.get('redirect') || '/dashboard');

  const expected = process.env.ADMIN_DASH_TOKEN || '';
  if (!expected) {
    // If no token configured, allow access
    return NextResponse.redirect(new URL(redirect, req.url));
  }

  if (password !== expected) {
    const url = new URL(redirect, req.url);
    url.searchParams.set('error', 'invalid');
    return NextResponse.redirect(url);
  }

  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set('dash', expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8 // 8 hours
  });
  res.cookies.set('dash_ui', '1', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8
  });
  return res;
}


