import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';
import { getSecurityHeaders, checkRateLimit, getClientIP, createAuditLog } from '@/lib/security';

const publicPaths = ['/', '/demo', '/login', '/register', '/api/auth/login', '/api/auth/register'];
const authPaths = ['/login', '/register'];
const rateLimitedPaths = ['/api/auth/login', '/api/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);
  
  // Create response with security headers
  const response = NextResponse.next();
  const securityHeaders = getSecurityHeaders();
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Rate limiting for auth endpoints
  if (rateLimitedPaths.some(path => pathname === path)) {
    const rateLimit = checkRateLimit(`auth:${clientIP}`, 5, 15 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            ...securityHeaders,
          }
        }
      );
    }
  }

  // General API rate limiting
  if (pathname.startsWith('/api/') && !rateLimitedPaths.some(path => pathname === path)) {
    const rateLimit = checkRateLimit(`api:${clientIP}`, 100, 15 * 60 * 1000);
    
    if (!rateLimit.allowed) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: 'API rate limit exceeded. Please try again later.'
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...securityHeaders,
          }
        }
      );
    }
  }
  
  // Allow public paths (landing page, demo, auth pages)
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path))) {
    return response;
  }

  // Check for access token
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('accessToken')?.value;

  if (!token) {
    // Log unauthorized access attempt
    console.log('Unauthorized access attempt:', createAuditLog(
      'UNAUTHORIZED_ACCESS',
      pathname,
      request,
      undefined,
      false
    ));
    
    // No token, redirect to landing page
    const redirectResponse = NextResponse.redirect(new URL('/', request.url));
    Object.entries(securityHeaders).forEach(([key, value]) => {
      redirectResponse.headers.set(key, value);
    });
    return redirectResponse;
  }

  // Verify token
  const payload = token && typeof token === 'string' && token.length > 0 ? verifyAccessToken(token) : null;
  
  if (!payload) {
    // Log invalid token attempt
    console.log('Invalid token access:', createAuditLog(
      'INVALID_TOKEN',
      pathname,
      request,
      undefined,
      false
    ));
    
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
    '/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js).*)',
  ],
};