# Clerk Integration Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Runtime Error: "Cannot read properties of undefined (reading 'call')"

This error typically occurs when there's an issue with the Clerk setup or environment variables.

#### Solution Steps:

1. **Check Environment Variables**
   ```bash
   # Ensure these are set in .env.local
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

2. **Verify Clerk Provider Setup**
   ```typescript
   // app/layout.tsx - Simplified setup
   <html lang="en">
     <body>
       <ClerkProvider>
         {children}
       </ClerkProvider>
     </body>
   </html>
   ```

3. **Test Clerk Integration**
   - Visit `/test-clerk` to verify Clerk is working
   - Check browser console for any errors
   - Verify network requests to Clerk API

### Build Issues

#### EPERM Error (Permission Denied)
```bash
# Clear Next.js cache
rm -rf .next
# Or on Windows
rmdir /s .next

# Restart development server
npm run dev
```

#### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Common fixes:
# 1. Update Clerk imports to use /server for API routes
# 2. Use async/await for auth() calls
# 3. Check middleware configuration
```

### Authentication Flow Issues

#### Users Not Redirected After Sign-in
```typescript
// Check middleware configuration
const isPublicRoute = createRouteMatcher([
  '/',
  '/demo',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

// Ensure afterAuth logic is correct
if (auth().userId && isAuthPage) {
  return NextResponse.redirect('/dashboard');
}
```

#### API Routes Not Protected
```typescript
// Use Clerk server-side auth
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... rest of API logic
}
```

### Development vs Production Issues

#### Environment Variables
```bash
# Development (.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Production (Vercel Environment Variables)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

#### Domain Configuration
- Development: `http://localhost:3000`
- Production: `https://your-domain.vercel.app`
- Update Clerk dashboard with correct domains

### Debugging Steps

1. **Enable Debug Mode**
   ```bash
   # Add to .env.local
   CLERK_DEBUG=true
   ```

2. **Check Network Tab**
   - Look for failed requests to Clerk API
   - Verify API keys are being sent correctly
   - Check for CORS issues

3. **Console Logging**
   ```typescript
   // Add to useAuth hook
   console.log('Clerk user:', clerkUser);
   console.log('Is signed in:', isSignedIn);
   console.log('Is loaded:', isLoaded);
   ```

4. **Test Clerk Components**
   ```typescript
   // Simple test component
   import { useUser } from '@clerk/nextjs';
   
   export function ClerkTest() {
     const { user, isLoaded } = useUser();
     return (
       <div>
         <p>Loaded: {isLoaded ? 'Yes' : 'No'}</p>
         <p>User: {user ? user.id : 'None'}</p>
       </div>
     );
   }
   ```

### Quick Fixes

#### Reset Clerk Configuration
1. Remove all Clerk-related code temporarily
2. Install fresh Clerk package: `npm install @clerk/nextjs@latest`
3. Follow minimal setup guide
4. Gradually add customizations

#### Fallback to Demo Mode
If Clerk issues persist, users can still access the app via:
- `/demo` - Full demo mode without authentication
- All features work in demo mode for testing

#### Environment Variable Template
```bash
# Copy this to .env.local and fill in your values
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Getting Help

1. **Clerk Documentation**: https://clerk.com/docs
2. **Clerk Discord**: Active community support
3. **GitHub Issues**: Check for similar problems
4. **Test Page**: Visit `/test-clerk` to verify setup

### Rollback Plan

If Clerk integration causes issues, you can:
1. Revert to previous JWT-based auth (available in git history)
2. Use demo mode for immediate access
3. Disable authentication temporarily for development

Remember: The app is designed to work with or without authentication, so core functionality remains available even if auth issues occur.