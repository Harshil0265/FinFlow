import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId, createAuthResponse } from '@/lib/clerk-auth';
import SMSIntegrationService from '@/lib/sms-integration';
import { z } from 'zod';

const RegisterPhoneSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
  permissions: z.object({
    readSMS: z.boolean(),
    autoProcess: z.boolean(),
    realTimeSync: z.boolean(),
  }),
  settings: z.object({
    autoApprove: z.boolean().default(false),
    minConfidence: z.number().min(0.5).max(1).default(0.7),
    categories: z.array(z.string()).default([]),
    excludeKeywords: z.array(z.string()).default([]),
  }),
});

// Register phone number for SMS monitoring
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createAuthResponse(401, 'Authentication required');
    }

    const body = await request.json();
    const validatedData = RegisterPhoneSchema.parse(body);

    const smsService = SMSIntegrationService.getInstance();
    const result = await smsService.registerPhoneNumber(
      userId,
      validatedData.phoneNumber,
      validatedData.permissions,
      validatedData.settings
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          webhookUrl: result.webhookUrl,
          phoneNumber: validatedData.phoneNumber,
          status: 'registered'
        },
        message: 'Phone number registered successfully for SMS monitoring'
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Phone registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request data',
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to register phone number' },
      { status: 500 }
    );
  }
}

// Get SMS connection status
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createAuthResponse(401, 'Authentication required');
    }

    const smsService = SMSIntegrationService.getInstance();
    const connection = smsService.getConnectionStatus(userId);

    if (connection) {
      return NextResponse.json({
        success: true,
        data: {
          phoneNumber: connection.phoneNumber,
          isActive: connection.isActive,
          permissions: connection.permissions,
          settings: connection.settings,
          lastSyncTime: connection.lastSyncTime,
          totalProcessed: connection.totalProcessed
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No SMS connection registered'
      });
    }

  } catch (error: any) {
    console.error('Connection status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get connection status' },
      { status: 500 }
    );
  }
}

// Update SMS connection settings
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createAuthResponse(401, 'Authentication required');
    }

    const body = await request.json();
    const settings = z.object({
      autoApprove: z.boolean().optional(),
      minConfidence: z.number().min(0.5).max(1).optional(),
      categories: z.array(z.string()).optional(),
      excludeKeywords: z.array(z.string()).optional(),
    }).parse(body);

    const smsService = SMSIntegrationService.getInstance();
    const success = await smsService.updateConnectionSettings(userId, settings);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'SMS connection settings updated successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'SMS connection not found' },
        { status: 404 }
      );
    }

  } catch (error: any) {
    console.error('Settings update error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid settings data',
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// Deactivate SMS monitoring
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return createAuthResponse(401, 'Authentication required');
    }

    const smsService = SMSIntegrationService.getInstance();
    const success = await smsService.deactivateConnection(userId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'SMS monitoring deactivated successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'SMS connection not found' },
        { status: 404 }
      );
    }

  } catch (error: any) {
    console.error('Deactivation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to deactivate SMS monitoring' },
      { status: 500 }
    );
  }
}