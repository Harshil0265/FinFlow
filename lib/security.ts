import crypto from 'crypto';
import { NextRequest } from 'next/server';
import rateLimit from 'express-rate-limit';

// Security constants
export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: true,
  
  // Session security
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Rate limiting
  LOGIN_ATTEMPTS_LIMIT: 5,
  LOGIN_ATTEMPTS_WINDOW: 15 * 60 * 1000, // 15 minutes
  API_RATE_LIMIT: 100, // requests per window
  API_RATE_WINDOW: 15 * 60 * 1000, // 15 minutes
  
  // Security headers
  CONTENT_SECURITY_POLICY: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': ["'self'", 'https://api.exchangerate-api.com'],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },
};

// Password validation
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`);
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

// SQL injection prevention (for raw queries)
export function escapeSQL(input: string): string {
  return input.replace(/'/g, "''").replace(/;/g, '');
}

// XSS prevention
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generate secure random tokens
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Hash sensitive data
export function hashData(data: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(data, actualSalt, 10000, 64, 'sha512');
  return `${actualSalt}:${hash.toString('hex')}`;
}

// Verify hashed data
export function verifyHash(data: string, hashedData: string): boolean {
  const [salt, hash] = hashedData.split(':');
  const verifyHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512');
  return hash === verifyHash.toString('hex');
}

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string, 
  limit: number = SECURITY_CONFIG.API_RATE_LIMIT,
  windowMs: number = SECURITY_CONFIG.API_RATE_WINDOW
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset or initialize
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }
  
  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }
  
  // Increment count
  current.count++;
  rateLimitStore.set(key, current);
  
  return { 
    allowed: true, 
    remaining: limit - current.count, 
    resetTime: current.resetTime 
  };
}

// Get client IP address (Edge Runtime compatible)
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback for Edge Runtime
  return 'unknown';
}

// Security headers
export function getSecurityHeaders(): Record<string, string> {
  const csp = Object.entries(SECURITY_CONFIG.CONTENT_SECURITY_POLICY)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
    
  return {
    'Content-Security-Policy': csp,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-XSS-Protection': '1; mode=block',
  };
}

// Audit logging
export interface AuditLog {
  userId?: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  details?: any;
}

export function createAuditLog(
  action: string,
  resource: string,
  request: NextRequest,
  userId?: string,
  success: boolean = true,
  details?: any
): AuditLog {
  return {
    userId,
    action,
    resource,
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    timestamp: new Date(),
    success,
    details,
  };
}

// Data validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Secure cookie options
export function getSecureCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: SECURITY_CONFIG.SESSION_TIMEOUT,
    path: '/',
  };
}