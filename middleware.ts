import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/demo', '/login', '/register'];
const publicApiPaths = ['/api/auth/login', '/api/auth/register'];
const authPaths = ['/login', '/register'];

// Edge Runtime compatible security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create response with security headers
  const response = NextResponse.next();
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Allow public API paths
  if (publicApiPaths.some(path => pathname === path)) {
    return response;
  }
  
  // Allow public paths (landing page, demo, auth pages)
  if (publicPaths.some(path => pathname === path)) {
    return response;
  }

  // Check for access token
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('accessToken')?.value;

  if (!token) {
    // No token, redirect to landing page
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));
    Object.entries(securityHeaders).forEach(([key, value]) => {
      redirectResponse.headers.set(key, value);
    });
    return redirectResponse;
  }

  // Basic token validation (just check if it exists and has reasonable length)
  if (!token || token.length < 10) {
    // Invalid token, redirect to landing page
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));
    Object.entries(securityHeaders).forEach(([key, value]) => {
      redirectResponse.headers.set(key, value);
    });
    return redirectResponse;
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (authPaths.some(path => pathname.startsWith(path))) {
    const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
    Object.entries(securityHeaders).forEach(([key, value]) => {
      redirectResponse.headers.set(key, value);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js).*)',
  ],
};