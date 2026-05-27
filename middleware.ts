import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function hasSession(request: NextRequest) {
  return request.cookies.getAll().some((c) => c.name.includes('supabase') && c.name.includes('auth-token'));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith('/dashboard/admin') || pathname.startsWith('/dashboard/agent');

  if (isProtected && !hasSession(request)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/admin/:path*', '/dashboard/agent/:path*'],
};
