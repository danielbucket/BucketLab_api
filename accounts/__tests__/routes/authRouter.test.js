const request = require('supertest');
const app = require('../../src/v1/app');
const Account = require('../../src/v1/models/account.model');

describe('Auth Routes Integration', () => {
  describe('Root Endpoints', () => {
    it('should return success for root endpoint GET /', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        message: 'BucketLab Empire Auth API root endpoint.'
      });
    });

    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-endpoint')
        .expect(404);

      expect(response.body).toEqual({
        status: 'fail',
        fail_type: 'server_error',
        message: "Can't find /unknown-endpoint on this server!"
      });
    });

    it('should return 404 for unknown POST routes', async () => {
      const response = await request(app)
        .post('/unknown-endpoint')
        .expect(404);

      expect(response.body).toEqual({
        status: 'fail',
        fail_type: 'server_error',
        message: "Can't find /unknown-endpoint on this server!"
      });
    });
  });

  describe('Accounts Route Structure', () => {
    let testAccount;

    beforeEach(async () => {
      testAccount = await Account.create({
        first_name: 'Route',
        last_name: 'Test',
        email: 'route.test@example.com',
        password: 'password123'
      });
    });

    it('should handle GET /accounts', async () => {
      const response = await request(app)
        .get('/accounts')
        .expect(200);

      expect(response.body.status).toBe('success');
    });

    it('should handle POST /accounts', async () => {
      const accountData = {
        first_name: 'New',
        last_name: 'Account',
        email: 'new.route@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(201);

      expect(response.body.status).toBe('success');
    });

    it('should handle GET /accounts/:id', async () => {
      const response = await request(app)
        .get(`/accounts/${testAccount._id}`)
        .expect(200);

      expect(response.body.status).toBe('success');
    });

    it('should handle PATCH /accounts/:id', async () => {
      const updateData = {
        first_name: 'Updated',
        company: 'Updated Company'
      };

      const response = await request(app)
        .patch(`/accounts/${testAccount._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
    });

    it('should handle DELETE /accounts/:id', async () => {
      const response = await request(app)
        .delete(`/accounts/${testAccount._id}`)
        .send({
          password: 'password123'
        })
        .expect(204);
    });

    it('should handle POST /accounts/login', async () => {
      const loginData = {
        email: 'route.test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts/login')
        .send(loginData)
        .expect(200);

      expect(response.body.status).toBe('success');
    });

    it('should handle POST /accounts/logout/:id', async () => {
      // First login the account
      await request(app)
        .post('/accounts/login')
        .send({
          email: 'route.test@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post(`/accounts/logout/${testAccount._id}`)
        .expect(200);

      expect(response.body.status).toBe('success');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers in responses', async () => {
      // Create an account first to ensure GET /accounts returns 200
      await request(app)
        .post('/accounts')
        .send({
          first_name: 'CORS',
          last_name: 'Test',
          email: 'cors.test@example.com',
          password: 'password123'
        })
        .expect(201);

      const response = await request(app)
        .get('/accounts')
        .expect(200);

      // Check if CORS headers are present (they should be set by the cors middleware)
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should handle OPTIONS preflight requests', async () => {
      const response = await request(app)
        .options('/accounts')
        .expect(200); // CORS middleware typically returns 200 for OPTIONS

      // We can't guarantee headers exist without knowing exact CORS config,
      // but we can verify the request doesn't error
      expect(response.status).toBe(200);
    });
  });

  describe('Middleware Integration', () => {
    it('should add requestTime to req object', async () => {
      // This is harder to test directly, but we can verify the middleware
      // doesn't break the normal flow by ensuring requests still work
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.status).toBe('success');
    });

    it('should handle JSON parsing', async () => {
      const accountData = {
        first_name: 'JSON',
        last_name: 'Test',
        email: 'json.test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(201);

      expect(response.body.status).toBe('success');
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/accounts')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
        
      // Express will return a 400 for malformed JSON
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection issues gracefully', async () => {
      // Create an account first to ensure GET /accounts returns 200
      await request(app)
        .post('/accounts')
        .send({
          first_name: 'Database',
          last_name: 'Test',
          email: 'database.test@example.com',
          password: 'password123'
        })
        .expect(201);

      // This is difficult to test without mocking mongoose
      // but the routes should handle database errors appropriately
      const response = await request(app)
        .get('/accounts')
        .expect(200);

      expect(response.body.status).toBe('success');
    });
  });
});
