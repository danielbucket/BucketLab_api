const request = require('supertest');
const jwt = require('jsonwebtoken');
const express = require('express');
const Account = require('../src/v1/models/account.model');
const { authenticateToken } = require('../src/v1/middleware/jwtAuth');
const app = require('../src/v1/app');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

describe('JWT Authentication', () => {
  let testAccount;
  let token;

  beforeAll(async () => {
    // Clean up and create test account
    await Account.deleteMany({ email: 'jwt.test@example.com' });
    testAccount = await Account.create({
      first_name: 'JWT',
      last_name: 'Test',
      email: 'jwt.test@example.com',
      password: 'password123',
      permissions: 'user'
    });
  });

  it('should login and return a valid JWT token', async () => {
    const response = await request(app)
      .post('/accounts/login')
      .send({ email: 'jwt.test@example.com', password: 'password123' })
      .expect(200);
    expect(response.body.account.token).toBeDefined();
    token = response.body.account.token;
    // Check JWT format (3 parts)
    expect(token.split('.').length).toBe(3);
  });

  it('should have correct JWT payload structure', () => {
    const decoded = jwt.decode(token);
    expect(decoded).toHaveProperty('id');
    expect(decoded).toHaveProperty('email', 'jwt.test@example.com');
    expect(decoded).toHaveProperty('permissions', 'user');
    expect(decoded).toHaveProperty('iat');
    expect(decoded).toHaveProperty('exp');
  });

  describe('Protected route access', () => {
    // Create a dummy protected route for testing
    const protectedApp = express();
    protectedApp.use(express.json());
    protectedApp.get('/protected', authenticateToken, (req, res) => {
      res.status(200).json({ status: 'success', user: req.user });
    });

    it('should deny access without token', async () => {
      await request(protectedApp)
        .get('/protected')
        .expect(401);
    });

    it('should deny access with invalid token', async () => {
      await request(protectedApp)
        .get('/protected')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(403);
    });

    it('should allow access with valid token', async () => {
      const response = await request(protectedApp)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(response.body.status).toBe('success');
      expect(response.body.user.email).toBe('jwt.test@example.com');
    });
  });
});
