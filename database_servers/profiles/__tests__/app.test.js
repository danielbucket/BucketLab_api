const request = require('supertest');
const app = require('../src/v1/app');

describe('Auth App Configuration', () => {
  describe('Express App Setup', () => {
    it('should be defined and be a function', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    it('should have trust proxy enabled', () => {
      expect(app.get('trust proxy')).toBe(true);
    });
  });

  describe('Middleware Configuration', () => {
    it('should include CORS middleware', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      // CORS headers should be present
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should handle preflight OPTIONS requests', async () => {
      const response = await request(app)
        .options('/accounts');

      // Should return either 200 or 204 depending on CORS setup
      expect([200, 204].includes(response.status)).toBe(true);
      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });
  });

  describe('Request Logging Middleware', () => {
    beforeEach(() => {
      // Clear console mocks
      jest.clearAllMocks();
    });

    it('should add requestTime to requests', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      // The middleware should log the request
      // We can't directly test req.requestTime, but we can ensure the middleware doesn't break the flow
      expect(response.body.status).toBe('success');
    });

    it('should not break the request flow', async () => {
      // Test that the logging middleware doesn't interfere with normal operations
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('BucketLab Empire Auth API root endpoint.');
    });
  });

  describe('Route Configuration', () => {
    it('should serve root endpoint', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        message: 'BucketLab Empire Auth API root endpoint.'
      });
    });

    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toEqual({
        status: 'fail',
        fail_type: 'server_error',
        message: "Can't find /unknown-route on this server!"
      });
    });

    it('should handle 404 for all HTTP methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      
      for (const method of methods) {
        const response = await request(app)
          [method.toLowerCase()]('/non-existent-route')
          .expect(404);

        expect(response.body).toEqual({
          status: 'fail',
          fail_type: 'server_error',
          message: "Can't find /non-existent-route on this server!"
        });
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/accounts')
        .set('Content-Type', 'application/json')
        .send('{ "invalid": json }')
        .expect(400);

      // Express built-in error handling should catch JSON parse errors
    });

    it('should maintain consistent error response format for 404s', async () => {
      const paths = ['/invalid', '/accounts/invalid/route', '/totally/unknown'];

      for (const path of paths) {
        const response = await request(app)
          .get(path)
          .expect(404);

        expect(response.body).toHaveProperty('status', 'fail');
        expect(response.body).toHaveProperty('fail_type', 'server_error');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain(`Can't find ${path} on this server!`);
      }
    });
  });

  describe('Security Headers', () => {
    it('should include proper CORS configuration', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://app_server:4021');
    });

    it('should handle credentials in CORS', async () => {
      const response = await request(app)
        .options('/accounts');

      // Should return either 200 or 204 depending on CORS setup
      expect([200, 204].includes(response.status)).toBe(true);
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });

  describe('Content Type Handling', () => {
    it('should return JSON responses', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should handle malformed JSON gracefully', async () => {
      // Test with a simple route that doesn't hit the database
      const response = await request(app)
        .post('/accounts')
        .set('Content-Type', 'application/json')
        .send('{ "invalid": json }');

      // Express should return 400 for malformed JSON
      expect(response.status).toBe(400);
    });
  });
});
