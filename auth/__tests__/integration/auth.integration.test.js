const request = require('supertest');
const app = require('../../src/v1/app');
const Account = require('../../src/v1/models/account.model');

describe('Auth Service Integration Tests', () => {
  describe('Complete Account Lifecycle', () => {
    let createdAccountId;
    const testEmail = 'lifecycle@example.com';

    it('should complete full account lifecycle: create -> login -> update -> logout -> delete', async () => {
      // Create account
      const createResponse = await request(app)
        .post('/accounts')
        .send({
          first_name: 'Lifecycle',
          last_name: 'Test',
          email: testEmail,
          password: 'password123'
        })
        .expect(201);

      expect(createResponse.body.status).toBe('success');
      expect(createResponse.body.data.email).toBe(testEmail);

      // Get the created account ID for further operations
      const createdAccount = await Account.findOne({ email: testEmail });
      createdAccountId = createdAccount._id.toString();

      // Login
      const loginResponse = await request(app)
        .post('/accounts/login')
        .send({
          email: testEmail,
          password: 'password123'
        })
        .expect(200);

      expect(loginResponse.body.status).toBe('success');
      expect(loginResponse.body.account.first_name).toBe('Lifecycle');
      expect(loginResponse.body.account.logged_in).toBe(true);

      // Update account
      const updateResponse = await request(app)
        .patch(`/accounts/${createdAccountId}`)
        .send({
          first_name: 'Updated',
          company: 'Test Company'
        })
        .expect(200);

      expect(updateResponse.body.status).toBe('success');
      expect(updateResponse.body.data.saved.first_name).toBe('Updated');

      // Get updated account to verify
      const getResponse = await request(app)
        .get(`/accounts/${createdAccountId}`)
        .expect(200);

      expect(getResponse.body.status).toBe('success');
      expect(getResponse.body.data.doc.first_name).toBe('Updated');
      expect(getResponse.body.data.doc.company).toBe('Test Company');

      // Logout
      const logoutResponse = await request(app)
        .post(`/accounts/logout/${createdAccountId}`)
        .expect(200);

      expect(logoutResponse.body.status).toBe('success');

      // Delete account
      const deleteResponse = await request(app)
        .delete(`/accounts/${createdAccountId}`)
        .send({
          password: 'password123'
        })
        .expect(204);

      // Verify account is deleted
      const verifyDeleteResponse = await request(app)
        .get(`/accounts/${createdAccountId}`)
        .expect(404);
    });
  });

  describe('Multiple Users Interaction', () => {
    it('should handle multiple concurrent logins', async () => {
      // Create multiple users
      const users = [];
      for (let i = 0; i < 3; i++) {
        const user = await request(app)
          .post('/accounts')
          .send({
            first_name: `User${i}`,
            last_name: 'Test',
            email: `user${i}@example.com`,
            password: 'password123'
          })
          .expect(201);
        users.push(user.body);
      }

      // Login all users concurrently
      const loginPromises = users.map((user, i) =>
        request(app)
          .post('/accounts/login')
          .send({
            email: `user${i}@example.com`,
            password: 'password123'
          })
          .expect(200)
      );

      const loginResponses = await Promise.all(loginPromises);

      // All logins should succeed
      loginResponses.forEach((response, i) => {
        expect(response.body.status).toBe('success');
        expect(response.body.account.first_name).toBe(`User${i}`);
        expect(response.body.account.logged_in).toBe(true);
      });
    });

    it('should return all users in get_all_accounts when users exist', async () => {
      // Create at least one user first to ensure results exist
      await request(app)
        .post('/accounts')
        .send({
          first_name: 'Integration',
          last_name: 'Test',
          email: 'integration@example.com',
          password: 'password123'
        })
        .expect(201);

      const response = await request(app)
        .get('/accounts')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.results).toBeGreaterThan(0);
      expect(Array.isArray(response.body.data.found)).toBe(true);
    });
  });
});
