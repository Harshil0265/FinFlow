import { POST as registerHandler } from '@/app/api/auth/register/route';
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// Mock dependencies
jest.mock('@/lib/mongodb');
jest.mock('@/lib/models/User');

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockUser = User as jest.Mocked<typeof User>;

describe('/api/auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue(undefined);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockUser.findOne.mockResolvedValue(null);
      mockUser.prototype.save = jest.fn().mockResolvedValue({
        _id: 'user123',
        ...userData,
        toJSON: () => ({ _id: 'user123', name: userData.name, email: userData.email }),
      });

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await registerHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.user.email).toBe(userData.email);
      expect(result.accessToken).toBeDefined();
    });

    it('should return error if user already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockUser.findOne.mockResolvedValue({ email: userData.email });

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await registerHandler(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.message).toBe('User already exists');
    });

    it('should return validation error for invalid input', async () => {
      const invalidData = {
        name: 'J', // Too short
        email: 'invalid-email',
        password: '123', // Too short
      };

      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await registerHandler(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid input data');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUserDoc = {
        _id: 'user123',
        email: loginData.email,
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ _id: 'user123', email: loginData.email }),
      };

      mockUser.findOne.mockResolvedValue(mockUserDoc);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.user.email).toBe(loginData.email);
      expect(result.accessToken).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockUser.findOne.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await loginHandler(request);
      const result = await response.json();

      expect(response.status).toBe(401);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials');
    });
  });
});