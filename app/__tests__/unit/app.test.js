const request = require('supertest');
const app = require('../../src/v1/app');

describe('App Main Tests', () => {
  describe('Application Initialization', () => {
    test('should create Express app successfully', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });

    test('should handle basic middleware setup', () => {
      // App should have middleware configured
      expect(app._router).toBeDefined();
      expect(app._router.stack.length).toBeGreaterThan(0);
    });
  });

  describe('Route Configuration', () => {
    test('should have root route configured', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('should have proxy routes configured', () => {
      // Check that the app has routes configured
      const routes = [];
      app._router.stack.forEach((middleware) => {
        if (middleware.route) {
          routes.push(middleware.route.path);
        } else if (middleware.name === 'router') {
          // This might be a proxy middleware
          routes.push('proxy-middleware');
        }
      });

      expect(routes.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle uncaught routes properly', async () => {
      const response = await request(app)
        .get('/this-route-does-not-exist')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
});
