import { NextRequest, NextResponse } from 'next/server';
import SMSIntegrationService, { SMSWebhookPayload } from '@/lib/sms-integration';
import { z } from 'zod';

// Webhook payload validation schema
const WebhookSchema = z.object({
  phoneNumber: z.string().min(10),
  message: z.string().min(1),
  timestamp: z.string().transform(str => new Date(str)),
  sender: z.string(),
  messageId: z.string(),
  // Optional webhook authentication
  signature: z.string().optional(),
  apiKey: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate webhook payload
    const validatedData = WebhookSchema.parse(body);
    
    // Verify webhook authenticity (implement your own verification)
    if (!await verifyWebhookSignature(request, body)) {
      return NextResponse.json(
        { success: false, message: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const smsPayload: SMSWebhookPayload = {
      phoneNumber: validatedData.phoneNumber,
      message: validatedData.message,
      timestamp: validatedData.timestamp,
      sender: validatedData.sender,
      messageId: validatedData.messageId,
    };

    // Process the SMS through the integration service
    const smsService = SMSIntegrationService.getInstance();
    const result = await smsService.processIncomingSMS(smsPayload);

    // Log the processing result
    console.log('SMS processed:', {
      phoneNumber: smsPayload.phoneNumber,
      sender: smsPayload.sender,
      success: result.success,
      transactionCreated: result.transactionCreated,
      confidence: result.confidence
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: result.transactionCreated 
        ? 'Transaction created successfully' 
        : 'SMS processed, no transaction created'
    });

  } catch (error: any) {
    console.error('SMS webhook error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid webhook payload',
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to process SMS webhook' },
      { status: 500 }
    );
  }
}

// Verify webhook signature for security
async function verifyWebhookSignature(request: NextRequest, body: any): Promise<boolean> {
  // Implement your webhook signature verification here
  // This is crucial for security to prevent unauthorized webhook calls
  
  const signature = request.headers.get('x-webhook-signature');
  const apiKey = body.apiKey || request.headers.get('x-api-key');
  
  // For demo purposes, we'll accept requests with a valid API key
  // In production, implement proper HMAC signature verification
  const validApiKey = process.env.SMS_WEBHOOK_API_KEY;
  
  if (!validApiKey) {
    console.warn('SMS_WEBHOOK_API_KEY not configured, allowing all requests');
    return true; // Allow in development
  }
  
  return apiKey === validApiKey;
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'SMS webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}