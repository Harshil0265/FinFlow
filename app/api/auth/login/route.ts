import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateTokens, createSecureCookieOptions } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { 
  sanitizeInput, 
  checkRateLimit, 
  getClientIP, 
  createAuditLog 
} from '@/lib/security';

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  try {
    await connectDB();

    // Rate limiting - 5 attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(`login:${clientIP}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many login attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Sanitize input
    if (body.email) {
      body.email = sanitizeInput(body.email).toLowerCase();
    }
    
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      // Log failed login attempt
      console.log('Failed login attempt:', createAuditLog(
        'LOGIN_FAILED',
        '/api/auth/login',
        request,
        undefined,
        false,
        { reason: 'User not found', email: validatedData.email }
      ));
      
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      // Log failed login attempt
      console.log('Failed login attempt:', createAuditLog(
        'LOGIN_FAILED',
        '/api/auth/login',
        request,
        user._id.toString(),
        false,
        { reason: 'Invalid password', email: validatedData.email }
      ));
      
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.toJSON());

    // Log successful login
    console.log('Successful login:', createAuditLog(
      'LOGIN_SUCCESS',
      '/api/auth/login',
      request,
      user._id.toString(),
      true,
      { email: validatedData.email }
    ));

    // Create response
    const response = NextResponse.json({
      success: true,
      user: user.toJSON(),
      accessToken,
    });

    // Set refresh token as httpOnly cookie
    response.cookies.set('refreshToken', refreshToken, createSecureCookieOptions());

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Log system error
    console.log('Login system error:', createAuditLog(
      'LOGIN_ERROR',
      '/api/auth/login',
      request,
      undefined,
      false,
      { error: error.message }
    ));
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}