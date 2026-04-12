const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app.js');
const { tokenOriginStore, cleanupExpiredTokens } = require('../../optimization/singleOriginKey_auth.js');

describe('Single-Origin JWT Authentication Middleware', () => {
  let validToken;
  let expiredToken;
  const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  const validUserId = 'test-user-123';

  beforeAll(() => {
    // Generate a valid token
    validToken = jwt.sign(
      { id: validUserId, email: 'test@example.com' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Generate an expired token (negative expiresIn simulates past token)
    const expiredPayload = {
      id: 'expired-user',
      email: 'expired@example.com',
      iat: Math.floor(Date.now() / 1000) - (25 * 60 * 60) // 25 hours ago
    };
    expiredToken = jwt.sign(expiredPayload, JWT_SECRET);
  });

  beforeEach(() => {
    // Clear token store before each test
    tokenOriginStore.clear();
  });

  describe('Public Routes', () => {
    test('GET /hello-world should be accessible without token', async () => {
      const response = await request(app)
        .get('/hello-world')
        .expect(200);

      expect(response.body.message).toContain('Hello, world');
    });

    test('GET /health should be accessible without token', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
    });
  });

  describe('Token Validation', () => {
    test('should reject request without origin_auth_key header for protected route', async () => {
      const response = await request(app)
        .get('/profiles')
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Missing origin_auth_key header');
    });

    test('should reject expired token', async () => {
      const response = await request(app)
        .get('/profiles')
        .set('origin_auth_key', expiredToken)
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('expired');
    });

    test('should reject invalid token signature', async () => {
      const invalidToken = jwt.sign(
        { id: 'user', email: 'user@example.com' },
        'wrong-secret',
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/profiles')
        .set('origin_auth_key', invalidToken)
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Invalid token signature');
    });

    test('should accept valid token', async () => {
      const response = await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'test-agent/1.0')
        .set('origin', 'http://localhost:3000');

      // Should not return 401
      expect(response.status).not.toBe(401);
    });
  });

  describe('Origin Tracking', () => {
    test('should track first origin on initial request', async () => {
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Mozilla/5.0 Desktop')
        .set('origin', 'http://localhost:3000');

      expect(tokenOriginStore.has(validToken)).toBe(true);
      const record = tokenOriginStore.get(validToken);
      expect(record.origins.size).toBe(1);
      expect(record.userId).toBe(validUserId);
    });

    test('should not increase origin count for same origin', async () => {
      const userAgent = 'Mozilla/5.0 Desktop';
      
      // First request
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', userAgent)
        .set('origin', 'http://localhost:3000');

      const recordAfterFirst = tokenOriginStore.get(validToken);
      const countAfterFirst = recordAfterFirst.origins.size;

      // Second request with same user agent
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', userAgent)
        .set('origin', 'http://localhost:3000');

      const recordAfterSecond = tokenOriginStore.get(validToken);
      expect(recordAfterSecond.origins.size).toBe(countAfterFirst);
    });

    test('should track second origin', async () => {
      // First origin
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Mozilla/5.0 Desktop')
        .set('origin', 'http://localhost:3000');

      // Second origin (different user agent)
      const response = await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Chrome Mobile')
        .set('origin', 'http://mobile.localhost:3000');

      const record = tokenOriginStore.get(validToken);
      expect(record.origins.size).toBe(2);
      expect(response.status).not.toBe(403);
    });

    test('should reject token on third unique origin', async () => {
      // First origin
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Mozilla/5.0 Desktop')
        .set('origin', 'http://localhost:3000');

      // Second origin
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Chrome Mobile')
        .set('origin', 'http://mobile.localhost:3000');

      // Third origin (should trigger revocation)
      const response = await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Safari iPad')
        .set('origin', 'http://tablet.localhost:3000');

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('multiple locations');
    });
  });

  describe('Token Revocation', () => {
    test('should deny all subsequent requests after revocation', async () => {
      // First origin
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Mozilla/5.0 Desktop');

      // Second origin
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Chrome Mobile');

      // Third origin (revokes token)
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Safari iPad')
        .expect(403);

      // Fourth request should also fail
      const response = await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Mozilla/5.0 Desktop')
        .expect(403);

      expect(response.body.message).toContain('revoked');
    });

    test('should not affect different tokens', async () => {
      const token1 = jwt.sign({ id: 'user1' }, JWT_SECRET, { expiresIn: '24h' });
      const token2 = jwt.sign({ id: 'user2' }, JWT_SECRET, { expiresIn: '24h' });

      // Revoke token1
      await request(app).get('/profiles').set('origin_auth_key', token1).set('user-agent', 'UA1');
      await request(app).get('/profiles').set('origin_auth_key', token1).set('user-agent', 'UA2');
      await request(app).get('/profiles').set('origin_auth_key', token1).set('user-agent', 'UA3');

      // token2 should still work
      const response = await request(app)
        .get('/profiles')
        .set('origin_auth_key', token2)
        .set('user-agent', 'UA1')
        .expect(200);

      expect(response.status).not.toBe(403);
    });
  });

  describe('Origin Information Collection', () => {
    test('should attach origin data to request', async () => {
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Mozilla/5.0')
        .set('origin', 'http://localhost:3000');

      const record = tokenOriginStore.get(validToken);
      expect(record.originDetails.length).toBeGreaterThan(0);
      expect(record.originDetails[0]).toHaveProperty('ipAddress');
      expect(record.originDetails[0]).toHaveProperty('userAgent');
      expect(record.originDetails[0]).toHaveProperty('timestamp');
      expect(record.originDetails[0]).toHaveProperty('uniqueKey');
    });
  });

  describe('Token Cleanup', () => {
    test('should remove expired tokens on cleanup', async () => {
      // Create a token record with old timestamp
      const oldToken = jwt.sign({ id: 'old-user' }, JWT_SECRET, { expiresIn: '24h' });
      
      tokenOriginStore.set(oldToken, {
        origins: new Set(['origin1']),
        originDetails: [],
        firstSeenAt: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        userId: 'old-user',
        isRevoked: false
      });

      expect(tokenOriginStore.has(oldToken)).toBe(true);
      
      cleanupExpiredTokens();
      
      expect(tokenOriginStore.has(oldToken)).toBe(false);
    });

    test('should not remove valid tokens on cleanup', async () => {
      await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Mozilla/5.0');

      expect(tokenOriginStore.has(validToken)).toBe(true);
      
      cleanupExpiredTokens();
      
      expect(tokenOriginStore.has(validToken)).toBe(true);
    });
  });

  describe('Security Logging', () => {
    test('should log security alerts on multiple origins', async () => {
      const consoleSpy = jest.spyOn(console, 'error');

      // Trigger multi-origin detection
      await request(app).get('/profiles').set('origin_auth_key', validToken).set('user-agent', 'UA1');
      await request(app).get('/profiles').set('origin_auth_key', validToken).set('user-agent', 'UA2');
      await request(app).get('/profiles').set('origin_auth_key', validToken).set('user-agent', 'UA3');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('SECURITY ALERT'));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing user-agent header', async () => {
      const response = await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        // Intentionally not setting user-agent

      expect(response.status).not.toBe(500);
    });

    test('should handle requests from different IPs as different origins', async () => {
      // Note: This test is limited as supertest doesn't easily allow IP spoofing
      // In production, test with actual different IPs or mocking
      const response1 = await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Mozilla/5.0');

      const response2 = await request(app)
        .get('/profiles')
        .set('origin_auth_key', validToken)
        .set('user-agent', 'Chrome Mobile');

      expect(response1.status).not.toBe(403);
      expect(response2.status).not.toBe(403);
    });

    test('should handle empty token', async () => {
      const response = await request(app)
        .get('/profiles')
        .set('origin_auth_key', '')
        .expect(401);

      expect(response.body.status).toBe('fail');
    });
  });
});
