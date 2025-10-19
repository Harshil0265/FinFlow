import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateTokens, verifyRefreshToken, createSecureCookieOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Find user
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.toJSON());

    // Create response
    const response = NextResponse.json({
      success: true,
      user: user.toJSON(),
      accessToken,
    });

    // Set new refresh token as httpOnly cookie
    response.cookies.set('refreshToken', newRefreshToken, createSecureCookieOptions());

    return response;
  } catch (error: any) {
    console.error('Token refresh error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}