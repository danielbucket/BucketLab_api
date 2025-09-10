const request = require('supertest');
const app = require('../../src/v1/app');
const Account = require('../../src/v1/models/account.model');

describe('PATCH /accounts/:id (update_account_by_account_id)', () => {
  let testAccount;

  beforeEach(async () => {
    testAccount = await Account.create({
      first_name: 'Original',
      last_name: 'User',
      email: 'original@example.com',
      password: 'password123',
      company: 'Original Company'
    });
  });

  describe('Success Cases', () => {
    it('should update account with valid data', async () => {
      const updateData = {
        first_name: 'Updated',
        company: 'New Company'
      };

      const response = await request(app)
        .patch(`/accounts/${testAccount._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.saved).toBeDefined();
      expect(response.body.data.saved.first_name).toBe('Updated');
      expect(response.body.data.saved.company).toBe('New Company');
      expect(response.body.data.saved.last_name).toBe('User'); // Should remain unchanged

      // Verify in database
      const updatedAccount = await Account.findById(testAccount._id);
      expect(updatedAccount.first_name).toBe('Updated');
      expect(updatedAccount.company).toBe('New Company');
      expect(updatedAccount.updated_at).not.toEqual(testAccount.updated_at);
    });

    it('should update single field', async () => {
      const updateData = {
        company: 'Solo Company Update'
      };

      const response = await request(app)
        .patch(`/accounts/${testAccount._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.saved.company).toBe('Solo Company Update');
      expect(response.body.data.saved.first_name).toBe('Original'); // Should remain unchanged
    });

    it('should update multiple fields', async () => {
      const updateData = {
        first_name: 'Multi',
        last_name: 'Update',
        company: 'Multi Company',
        phone: '555-123-4567'
      };

      const response = await request(app)
        .patch(`/accounts/${testAccount._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      const saved = response.body.data.saved;
      expect(saved.first_name).toBe('Multi');
      expect(saved.last_name).toBe('Update');
      expect(saved.company).toBe('Multi Company');
      expect(saved.phone).toBe('555-123-4567');
    });
  });

  describe('Error Cases', () => {
    it('should return 404 when account does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const updateData = {
        first_name: 'Updated'
      };

      const response = await request(app)
        .patch(`/accounts/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        status: 'fail',
        message: 'No account found with that ID.'
      });
    });

    it('should return 404 when trying to update field with empty value', async () => {
      const updateData = {
        first_name: '',
        company: 'Valid Company'
      };

      const response = await request(app)
        .patch(`/accounts/${testAccount._id}`)
        .send(updateData)
        .expect(404);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe("The key: 'first_name' cannot be updated.");
    });

    it('should return 404 when trying to update field with null value', async () => {
      const updateData = {
        company: null
      };

      const response = await request(app)
        .patch(`/accounts/${testAccount._id}`)
        .send(updateData)
        .expect(404);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe("The key: 'company' cannot be updated.");
    });

    it('should successfully update when undefined values are stripped from JSON', async () => {
      const updateData = {
        company: undefined, // This will be stripped from JSON
        first_name: 'Valid Name' // Only this will be sent
      };

      const response = await request(app)
        .patch(`/accounts/${testAccount._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.saved.first_name).toBe('Valid Name');
      // Verify company field was not changed
      const updatedAccount = await Account.findById(testAccount._id);
      expect(updatedAccount.company).toBe('Original Company');
    });
  });

  describe('Validation Handling', () => {
    it('should handle validation errors during save', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .patch(`/accounts/${testAccount._id}`)
        .send(updateData)
        .expect(500);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Account update failed.');
    });

    it('should handle updating to duplicate email', async () => {
      // Create another account first
      await Account.create({
        first_name: 'Other',
        last_name: 'User',
        email: 'other@example.com',
        password: 'password123'
      });

      const updateData = {
        email: 'other@example.com'
      };

      const response = await request(app)
        .patch(`/accounts/${testAccount._id}`)
        .send(updateData)
        .expect(500);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Account update failed.');
    });
  });
});
