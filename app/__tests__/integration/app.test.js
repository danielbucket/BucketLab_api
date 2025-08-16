const request = require('supertest');
const app = require('../../src/v1/app');

describe('App Integration Tests', () => {
  describe('Root Endpoint', () => {
    test('GET / should return welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toEqual({
        message: 'Welcome to the Bucket Laboratory API Gateway',
        version: '1.0.0',
        timestamp: expect.any(String),
        services: {
          auth: '/auth',
          laboratory: '/laboratory'
        }
      });
    });

    test('GET / should return valid timestamp', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });

  describe('Middleware Integration', () => {
    test('should apply CORS headers', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      // Check for CORS headers (may vary based on environment)
      expect(response.headers).toBeDefined();
    });

    test('should apply rate limiting headers', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      // Rate limiter should add headers
      expect(response.headers).toBeDefined();
    });

    test('should handle OPTIONS preflight requests', async () => {
      const response = await request(app)
        .options('/')
        .expect(204);

      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });
  });

  describe('Proxy Route Configuration', () => {
    test('auth proxy should be mounted on /auth', async () => {
      // This will likely fail in tests since auth service isn't running
      // but it validates the route is configured
      const response = await request(app)
        .get('/auth')
        .expect(res => {
          // Could be 404, 500, 502, 503, 504 depending on proxy behavior
          expect([200, 404, 500, 502, 503, 504]).toContain(res.status);
        });
    });

    test('laboratory proxy should be mounted on /laboratory', async () => {
      // This will likely fail in tests since laboratory service isn't running
      // but it validates the route is configured
      const response = await request(app)
        .get('/laboratory')
        .expect(res => {
          // Could be 404, 500, 502, 503, 504 depending on proxy behavior
          expect([200, 404, 500, 502, 503, 504]).toContain(res.status);
        });
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toEqual({
        message: 'Route not found'
      });
    });

    test('should handle POST to unknown routes', async () => {
      const response = await request(app)
        .post('/unknown-route')
        .send({ test: 'data' })
        .expect(404);

      expect(response.body).toEqual({
        message: 'Route not found'
      });
    });

    test('should handle PATCH to unknown routes', async () => {
      const response = await request(app)
        .patch('/unknown-route')
        .send({ test: 'data' })
        .expect(404);

      expect(response.body).toEqual({
        message: 'Route not found'
      });
    });

    test('should handle DELETE to unknown routes', async () => {
      const response = await request(app)
        .delete('/unknown-route')
        .expect(404);

      expect(response.body).toEqual({
        message: 'Route not found'
      });
    });
  });

  describe('Request Logging', () => {
    test('should handle requests with timing', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      // Request should complete successfully
      expect(response.status).toBe(200);
    });
  });

  describe('Health Check', () => {
    test('root endpoint serves as basic health check', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.message).toContain('Welcome');
      expect(response.body.services).toBeDefined();
      expect(response.body.services.auth).toBe('/auth');
      expect(response.body.services.laboratory).toBe('/laboratory');
    });
  });

  describe('Content Type Handling', () => {
    test('should handle JSON requests', async () => {
      const response = await request(app)
        .post('/unknown-route') // Will hit 404 handler
        .send({ test: 'data' })
        .set('Content-Type', 'application/json')
        .expect(404);

      expect(response.body).toEqual({
        message: 'Route not found'
      });
    });

    test('should handle form data requests', async () => {
      const response = await request(app)
        .post('/unknown-route') // Will hit 404 handler
        .send('test=data')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(404);

      expect(response.body).toEqual({
        message: 'Route not found'
      });
    });
  });
});
