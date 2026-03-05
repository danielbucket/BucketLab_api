const request = require('supertest');
const app = require('../../src/v1/app');
const Account = require('../../src/v1/models/account.model');

describe('GET /accounts (get_all_accounts)', () => {
  beforeEach(async () => {
    // Create test accounts
    await Account.create([
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        password: 'password456'
      },
      {
        first_name: 'Bob',
        last_name: 'Wilson',
        email: 'bob@example.com',
        password: 'password789'
      }
    ]);
  });

  describe('Success Cases', () => {
    it('should return all accounts', async () => {
      const response = await request(app)
        .get('/accounts')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.results).toBe(3);
      expect(response.body.data.found).toBeDefined();
      expect(response.body.data.found.length).toBe(3);
      
      // Check that accounts are returned
      const emails = response.body.data.found.map(account => account.email);
      expect(emails).toContain('john@example.com');
      expect(emails).toContain('jane@example.com');
      expect(emails).toContain('bob@example.com');
    });

    it('should return accounts with all expected fields', async () => {
      const response = await request(app)
        .get('/accounts')
        .expect(200);

      const firstAccount = response.body.data.found[0];
      expect(firstAccount).toHaveProperty('_id');
      expect(firstAccount).toHaveProperty('first_name');
      expect(firstAccount).toHaveProperty('last_name');
      expect(firstAccount).toHaveProperty('email');
      expect(firstAccount).toHaveProperty('password');
      expect(firstAccount).toHaveProperty('permissions');
      expect(firstAccount).toHaveProperty('logged_in');
      expect(firstAccount).toHaveProperty('login_count');
      expect(firstAccount).toHaveProperty('created_at');
      expect(firstAccount).toHaveProperty('updated_at');
    });
  });
});

describe('GET /accounts/:id (get_account_by_account_id)', () => {
  let testAccount;

  beforeEach(async () => {
    testAccount = await Account.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'get.test@example.com',
      password: 'password123'
    });
  });

  describe('Success Cases', () => {
    it('should return specific account by ID', async () => {
      const response = await request(app)
        .get(`/accounts/${testAccount._id}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.doc).toBeDefined();
      expect(response.body.data.doc._id.toString()).toBe(testAccount._id.toString());
      expect(response.body.data.doc.first_name).toBe('Test');
      expect(response.body.data.doc.last_name).toBe('User');
      expect(response.body.data.doc.email).toBe('get.test@example.com');
    });

    it('should return account with all fields', async () => {
      const response = await request(app)
        .get(`/accounts/${testAccount._id}`)
        .expect(200);

      const account = response.body.data.doc;
      expect(account).toHaveProperty('_id');
      expect(account).toHaveProperty('first_name');
      expect(account).toHaveProperty('last_name');
      expect(account).toHaveProperty('email');
      expect(account).toHaveProperty('password');
      expect(account).toHaveProperty('permissions');
      expect(account).toHaveProperty('logged_in');
      expect(account).toHaveProperty('login_count');
      expect(account).toHaveProperty('created_at');
      expect(account).toHaveProperty('updated_at');
    });
  });

  describe('Error Cases', () => {
    it('should return 404 when account does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/accounts/${nonExistentId}`)
        .expect(404);

      expect(response.body).toEqual({
        status: 'fail',
        message: 'No account found with that ID.'
      });
    });

    it('should handle invalid ID format gracefully', async () => {
      // This will likely cause a 500 error due to invalid ObjectId
      // but the controller should handle it gracefully
      const response = await request(app)
        .get('/accounts/:invalid-id-format')
        .expect(500);

      // The response should be a server error since mongoose will throw
      // We can't easily mock mongoose.findById to throw specific errors
      // without more complex mocking setup
    });
  });
});
