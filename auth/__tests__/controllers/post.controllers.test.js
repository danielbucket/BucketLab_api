const request = require('supertest');
const app = require('../../src/v1/app');
const Account = require('../../src/v1/models/account.model');

describe('POST /accounts (new_account)', () => {
  describe('Success Cases', () => {
    it('should create a new account with valid data', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(201);

      expect(response.body).toEqual({
        status: 'success',
        message: 'Account created successfully.',
        data: {
          email: 'john.doe@example.com',
          first_name: 'John'
        }
      });

      // Verify account was actually created in database
      const createdAccount = await Account.findOne({ email: 'john.doe@example.com' });
      expect(createdAccount).toBeTruthy();
      expect(createdAccount.first_name).toBe('John');
      expect(createdAccount.last_name).toBe('Doe');
    });
  });

  describe('Validation Errors', () => {
    it('should return 422 when first_name is missing', async () => {
      const accountData = {
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(422);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Missing required parameter: first_name.'
      });
    });

    it('should return 422 when last_name is missing', async () => {
      const accountData = {
        first_name: 'John',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(422);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Missing required parameter: last_name.'
      });
    });

    it('should return 422 when email is missing', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(422);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Missing required parameter: email.'
      });
    });

    it('should return 422 when password is missing', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com'
      };

      const response = await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(422);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Missing required parameter: password.'
      });
    });
  });

  describe('Duplicate Email Handling', () => {
    it('should return 409 when email already exists', async () => {
      // Create first account
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(201);

      // Try to create account with same email
      const duplicateData = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'duplicate@example.com',
        password: 'password456'
      };

      const response = await request(app)
        .post('/accounts')
        .send(duplicateData)
        .expect(409);

      expect(response.body).toEqual({
        status: 'fail',
        fail_type: 'duplicate',
        message: 'An account with that email already exists.',
        data: { email: 'duplicate@example.com' }
      });
    });
  });

  describe('Database Validation Errors', () => {
    it('should return 500 when account creation fails due to validation', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(500);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Account creation failed.');
      expect(response.body.error).toBeDefined();
    });

    it('should return 500 when password is too short', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.short@example.com',
        password: '123' // Too short
      };

      const response = await request(app)
        .post('/accounts')
        .send(accountData)
        .expect(500);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Account creation failed.');
    });
  });
});

describe('POST /accounts/login (login_account)', () => {
  beforeEach(async () => {
    // Create a test account for login tests
    await Account.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'password123'
    });
  });

  describe('Success Cases', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts/login')
        .send(loginData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Login successful.');
      expect(response.body.account).toBeDefined();
      expect(response.body.account.first_name).toBe('Test');
      expect(response.body.account.logged_in).toBe(true);
      expect(response.body.account.login_count).toBe(1);
      expect(response.body.account.token).toBeDefined();

      // Verify account was updated in database
      const updatedAccount = await Account.findOne({ email: 'test@example.com' });
      expect(updatedAccount.logged_in).toBe(true);
      expect(updatedAccount.login_count).toBe(1);
      expect(updatedAccount.logged_in_at).toBeDefined();
    });
  });

  describe('Validation Errors', () => {
    it('should return 422 when email is missing', async () => {
      const loginData = {
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts/login')
        .send(loginData)
        .expect(422);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Missing required parameter: email.'
      });
    });

    it('should return 422 when password is missing', async () => {
      const loginData = {
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/accounts/login')
        .send(loginData)
        .expect(422);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Missing required parameter: password.'
      });
    });
  });

  describe('Authentication Errors', () => {
    it('should return 404 when account does not exist', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/accounts/login')
        .send(loginData)
        .expect(404);

      expect(response.body).toEqual({
        status: 'fail',
        fail_type: 'not_found',
        message: 'No Account found with that email.'
      });
    });

    it('should return 404 when password is incorrect', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/accounts/login')
        .send(loginData)
        .expect(404);

      expect(response.body).toEqual({
        status: 'fail',
        fail_type: 'invalid_password',
        message: 'Invalid password.'
      });
    });
  });
});

describe('POST /accounts/logout/:id (logout_account_by_account_id)', () => {
  let testAccount;

  beforeEach(async () => {
    testAccount = await Account.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'logout.test@example.com',
      password: 'password123',
      logged_in: true,
      login_count: 1
    });
  });

  describe('Success Cases', () => {
    it('should logout successfully with valid account ID', async () => {
      const response = await request(app)
        .post(`/accounts/logout/${testAccount._id}`)
        .expect(200);

      expect(response.body).toEqual({
        status: 'success'
      });

      // Verify account was updated in database
      const updatedAccount = await Account.findById(testAccount._id);
      expect(updatedAccount.logged_in).toBe(false);
      expect(updatedAccount.logged_in_at).toBeNull();
      expect(updatedAccount.last_logout_at).toBeDefined();
    });
  });

  describe('Validation Errors', () => {
    it('should return 422 when ID format is invalid', async () => {
      const response = await request(app)
        .post('/accounts/logout/:invalid-id')
        .expect(422);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid ID format.'
      });
    });
  });

  describe('Not Found Errors', () => {
    it('should return 404 when account does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .post(`/accounts/logout/${nonExistentId}`)
        .expect(404);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe('No account found with that ID.');
      expect(response.body.id).toBe(nonExistentId);
    });
  });
});
