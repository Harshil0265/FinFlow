import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/demo',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/test-clerk',
  '/simple-test',
  '/test-basic',
  '/api/webhooks(.*)',
  '/api/sms/webhook',
]);

export default clerkMiddleware(async (auth, request) => {
  // Add security headers to response
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Check if route is public
  if (isPublicRoute(request)) {
    return response;
  }

  // Get auth session
  const session = await auth();

  // Protect private routes
  if (!session.userId) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (session.userId && (request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};