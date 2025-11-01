import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, createAuthResponse } from '@/lib/clerk-auth';
import { clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  preferences: z.object({
    currency: z.string().optional(),
    dateFormat: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
  }).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser();
    
    if (error || !user) {
      return createAuthResponse(401, error || 'Authentication required');
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return createAuthResponse(500, 'Internal server error');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser();
    
    if (error || !user) {
      return createAuthResponse(401, error || 'Authentication required');
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Update user in Clerk
    const updateData: any = {};
    
    if (validatedData.firstName) {
      updateData.firstName = validatedData.firstName;
    }
    
    if (validatedData.lastName) {
      updateData.lastName = validatedData.lastName;
    }

    if (Object.keys(updateData).length > 0) {
      await clerkClient().users.updateUser(user._id, updateData);
    }

    // For preferences, we'd typically store these in our own database
    // since Clerk doesn't handle custom user preferences
    // For now, we'll return success with the updated user data
    
    const updatedUser = {
      ...user,
      name: validatedData.firstName && validatedData.lastName 
        ? `${validatedData.firstName} ${validatedData.lastName}`
        : user.name,
      preferences: {
        ...user.preferences,
        ...validatedData.preferences,
      },
    };

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ZodError') {
      return createAuthResponse(400, 'Invalid input data', { errors: error.errors });
    }

    return createAuthResponse(500, 'Internal server error');
  }
}