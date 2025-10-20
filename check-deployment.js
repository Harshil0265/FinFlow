#!/usr/bin/env node

/**
 * Deployment Status Checker for FinFlow
 * Verifies that the application is properly deployed and functioning
 */

const https = require('https');
const http = require('http');

const DEPLOYMENT_URL = 'https://fin-flow-cbrzmwa8z-harshils-projects-01fe30f4.vercel.app';
const TIMEOUT = 10000; // 10 seconds

function checkEndpoint(url, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, { timeout: TIMEOUT }, (res) => {
      const success = res.statusCode === expectedStatus;
      resolve({
        url,
        status: res.statusCode,
        success,
        message: success ? 'OK' : `Expected ${expectedStatus}, got ${res.statusCode}`
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({ url, error: 'Timeout' });
    });

    req.on('error', (error) => {
      reject({ url, error: error.message });
    });
  });
}

async function runDeploymentChecks() {
  console.log('🚀 FinFlow Deployment Status Check\n');
  console.log(`Checking deployment at: ${DEPLOYMENT_URL}\n`);

  const endpoints = [
    { path: '/', name: 'Landing Page' },
    { path: '/demo', name: 'Demo Page' },
    { path: '/login', name: 'Login Page' },
    { path: '/register', name: 'Register Page' },
    { path: '/api/auth/me', name: 'Auth API', expectedStatus: 401 }, // Should return 401 without token
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`Checking ${endpoint.name}...`);
      const result = await checkEndpoint(
        `${DEPLOYMENT_URL}${endpoint.path}`,
        endpoint.expectedStatus || 200
      );
      results.push({ ...endpoint, ...result });
      console.log(`✅ ${endpoint.name}: ${result.message}`);
    } catch (error) {
      results.push({ ...endpoint, success: false, error: error.error });
      console.log(`❌ ${endpoint.name}: ${error.error}`);
    }
  }

  console.log('\n📊 Summary:');
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`${successful}/${total} endpoints are working correctly`);
  
  if (successful === total) {
    console.log('\n🎉 All systems operational! Your FinFlow app is live and ready.');
    console.log(`\n🌐 Visit your app: ${DEPLOYMENT_URL}`);
    console.log('📚 Documentation: ./VERCEL-DEPLOYMENT.md');
  } else {
    console.log('\n⚠️  Some issues detected. Check the logs above.');
    process.exit(1);
  }
}

// Run the checks
runDeploymentChecks().catch(console.error);