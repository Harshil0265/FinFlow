#!/usr/bin/env node

/**
 * SMS Webhook Tester
 * Test the SMS webhook endpoint with sample bank SMS messages
 */

const https = require('https');
const crypto = require('crypto');

// Configuration
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/sms/webhook';
const API_KEY = process.env.SMS_WEBHOOK_API_KEY || 'test-api-key';
const WEBHOOK_SECRET = process.env.SMS_WEBHOOK_SECRET || 'test-secret';

// Sample SMS messages for testing
const SAMPLE_SMS_MESSAGES = [
  {
    phoneNumber: '+919876543210',
    message: 'HDFC Bank: Rs.500.00 debited from A/C **1234 on 15-Dec-23 at SWIGGY BANGALORE. Avl Bal: Rs.10,000.00',
    sender: 'HDFCBK',
    description: 'HDFC Bank - Swiggy Payment'
  },
  {
    phoneNumber: '+919876543210',
    message: 'SBI: Rs.1,200.00 credited to A/C **5678 on 14-Dec-23 salary from COMPANY NAME. Avl Bal: Rs.15,000.00',
    sender: 'SBMSBI',
    description: 'SBI Bank - Salary Credit'
  },
  {
    phoneNumber: '+919876543210',
    message: 'ICICI Bank: Rs.250.00 spent on Debit Card **9876 at AMAZON on 13-Dec-23. Avl Bal: Rs.8,500.00',
    sender: 'ICICIB',
    description: 'ICICI Bank - Amazon Purchase'
  },
  {
    phoneNumber: '+919876543210',
    message: 'Your UPI transaction of Rs.75.00 to UBER INDIA at 12:30 PM on 12-Dec-23 is successful. Ref: 123456789',
    sender: 'PAYTM',
    description: 'UPI - Uber Payment'
  },
  {
    phoneNumber: '+919876543210',
    message: 'ATM Withdrawal: Rs.2000.00 from A/C **1234 at HDFC ATM on 11-Dec-23 at 18:45. Avl Bal: Rs.8,000.00',
    sender: 'HDFCBK',
    description: 'HDFC Bank - ATM Withdrawal'
  }
];

// Generate webhook signature
function generateSignature(timestamp, payload, secret) {
  const data = timestamp + payload;
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

// Send webhook request
async function sendWebhook(smsData) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now().toString();
    const payload = JSON.stringify({
      ...smsData,
      timestamp: new Date().toISOString(),
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      apiKey: API_KEY
    });

    const signature = generateSignature(timestamp, payload, WEBHOOK_SECRET);
    
    const url = new URL(WEBHOOK_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'X-Webhook-Signature': signature,
        'X-Timestamp': timestamp,
        'X-API-Key': API_KEY,
        'User-Agent': 'SMS-Webhook-Tester/1.0'
      }
    };

    const protocol = url.protocol === 'https:' ? https : require('http');
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: response
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// Test all sample messages
async function runTests() {
  console.log('🧪 SMS Webhook Tester');
  console.log('===================');
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log(`API Key: ${API_KEY ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`Webhook Secret: ${WEBHOOK_SECRET ? '✓ Configured' : '✗ Not configured'}`);
  console.log('');

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < SAMPLE_SMS_MESSAGES.length; i++) {
    const sms = SAMPLE_SMS_MESSAGES[i];
    console.log(`Test ${i + 1}: ${sms.description}`);
    console.log(`SMS: ${sms.message.substring(0, 60)}...`);
    
    try {
      const response = await sendWebhook(sms);
      
      if (response.statusCode === 200) {
        console.log(`✅ Success (${response.statusCode})`);
        if (response.body.data) {
          console.log(`   Transaction Created: ${response.body.data.transactionCreated ? 'Yes' : 'No'}`);
          if (response.body.data.confidence) {
            console.log(`   Confidence: ${(response.body.data.confidence * 100).toFixed(1)}%`);
          }
        }
        successCount++;
      } else {
        console.log(`❌ Failed (${response.statusCode})`);
        console.log(`   Error: ${response.body.message || 'Unknown error'}`);
        failureCount++;
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      failureCount++;
    }
    
    console.log('');
    
    // Add delay between requests
    if (i < SAMPLE_SMS_MESSAGES.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('📊 Test Results');
  console.log('===============');
  console.log(`Total Tests: ${SAMPLE_SMS_MESSAGES.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failureCount}`);
  console.log(`Success Rate: ${((successCount / SAMPLE_SMS_MESSAGES.length) * 100).toFixed(1)}%`);
  
  if (failureCount > 0) {
    console.log('\n⚠️  Some tests failed. Check your webhook configuration and server logs.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Your SMS webhook is working correctly.');
  }
}

// Health check
async function healthCheck() {
  console.log('🏥 Health Check');
  console.log('===============');
  
  try {
    const url = new URL(WEBHOOK_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'SMS-Webhook-Tester/1.0'
      }
    };

    const protocol = url.protocol === 'https:' ? https : require('http');
    
    const response = await new Promise((resolve, reject) => {
      const req = protocol.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              body: JSON.parse(data)
            });
          } catch {
            resolve({
              statusCode: res.statusCode,
              body: data
            });
          }
        });
      });
      
      req.on('error', reject);
      req.end();
    });

    if (response.statusCode === 200) {
      console.log('✅ Webhook endpoint is healthy');
      console.log(`   Response: ${response.body.message || 'OK'}`);
      return true;
    } else {
      console.log(`❌ Webhook endpoint returned ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--health')) {
    await healthCheck();
    return;
  }
  
  if (args.includes('--help')) {
    console.log('SMS Webhook Tester');
    console.log('');
    console.log('Usage:');
    console.log('  node test-sms-webhook.js           Run all tests');
    console.log('  node test-sms-webhook.js --health  Health check only');
    console.log('  node test-sms-webhook.js --help    Show this help');
    console.log('');
    console.log('Environment Variables:');
    console.log('  WEBHOOK_URL           Webhook endpoint URL');
    console.log('  SMS_WEBHOOK_API_KEY   API key for authentication');
    console.log('  SMS_WEBHOOK_SECRET    Secret for signature verification');
    return;
  }

  // Run health check first
  console.log('Starting SMS webhook tests...\n');
  const isHealthy = await healthCheck();
  console.log('');
  
  if (!isHealthy) {
    console.log('❌ Health check failed. Skipping tests.');
    process.exit(1);
  }
  
  // Run the tests
  await runTests();
}

// Run the script
main().catch(console.error);