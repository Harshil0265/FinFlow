import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateTokens, createSecureCookieOptions } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User(validatedData);
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.toJSON());

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
    console.error('Registration error:', error);
    
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