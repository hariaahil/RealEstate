import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function hasSupabaseSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => cookie.name.includes('supabase') && cookie.name.includes('auth-token'));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if ((pathname.startsWith('/dashboard/admin') || pathname.startsWith('/dashboard/agent') || pathname.startsWith('/dashboard/user')) && !hasSupabaseSessionCookie(request)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/admin/:path*', '/dashboard/agent/:path*', '/dashboard/user/:path*'],
};
