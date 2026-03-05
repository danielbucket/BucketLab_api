const request = require('supertest');
const app = require('../../src/v1/app');
const Account = require('../../src/v1/models/account.model');

describe('DELETE /accounts/:id (delete_account_by_account_id)', () => {
  let testAccount;

  beforeEach(async () => {
    testAccount = await Account.create({
      first_name: 'Delete',
      last_name: 'Test',
      email: 'delete.test@example.com',
      password: 'password123'
    });
  });

  describe('Success Cases', () => {
    it('should delete account with valid ID and password', async () => {
      const deleteData = {
        password: 'password123'
      };

      const response = await request(app)
        .delete(`/accounts/${testAccount._id}`)
        .send(deleteData)
        .expect(204);

      // For 204 responses, body should be empty
      expect(Object.keys(response.body)).toHaveLength(0);

      // Verify account was deleted from database
      const deletedAccount = await Account.findById(testAccount._id);
      expect(deletedAccount).toBeNull();
    });
  });

  describe('Authentication Errors', () => {
    it('should return 401 when password is incorrect', async () => {
      const deleteData = {
        password: 'wrongpassword'
      };

      const response = await request(app)
        .delete(`/accounts/${testAccount._id}`)
        .send(deleteData)
        .expect(401);

      expect(response.body).toEqual({
        status: 'fail',
        message: 'Incorrect password.'
      });

      // Verify account was NOT deleted from database
      const stillExistsAccount = await Account.findById(testAccount._id);
      expect(stillExistsAccount).toBeTruthy();
    });

    it('should return 401 when password is missing', async () => {
      const response = await request(app)
        .delete(`/accounts/${testAccount._id}`)
        .send({})
        .expect(401);

      expect(response.body).toEqual({
        status: 'fail',
        message: 'Incorrect password.'
      });

      // Verify account was NOT deleted from database
      const stillExistsAccount = await Account.findById(testAccount._id);
      expect(stillExistsAccount).toBeTruthy();
    });
  });

  describe('Not Found Errors', () => {
    it('should return 404 when account does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      const deleteData = {
        password: 'password123'
      };

      const response = await request(app)
        .delete(`/accounts/${nonExistentId}`)
        .send(deleteData)
        .expect(404);

      expect(response.body).toEqual({
        status: 'fail',
        message: 'No account found with that ID.'
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid ID format gracefully', async () => {
      const deleteData = {
        password: 'password123'
      };

      // This will likely cause a 500 error due to invalid ObjectId format
      const response = await request(app)
        .delete('/accounts/invalid-id-format')
        .send(deleteData)
        .expect(500);

      // The response should be a server error since mongoose will throw
      // when trying to use invalid ObjectId
    });

    it('should handle empty password field', async () => {
      const deleteData = {
        password: ''
      };

      const response = await request(app)
        .delete(`/accounts/${testAccount._id}`)
        .send(deleteData)
        .expect(401);

      expect(response.body).toEqual({
        status: 'fail',
        message: 'Incorrect password.'
      });
    });

    it('should handle null password field', async () => {
      const deleteData = {
        password: null
      };

      const response = await request(app)
        .delete(`/accounts/${testAccount._id}`)
        .send(deleteData)
        .expect(401);

      expect(response.body).toEqual({
        status: 'fail',
        message: 'Incorrect password.'
      });
    });
  });

  describe('Multiple Account Scenarios', () => {
    it('should only delete the specified account', async () => {
      // Create additional accounts
      const account2 = await Account.create({
        first_name: 'Keep',
        last_name: 'Me',
        email: 'keep@example.com',
        password: 'password456'
      });

      const account3 = await Account.create({
        first_name: 'Also',
        last_name: 'Keep',
        email: 'alsokenep@example.com',
        password: 'password789'
      });

      const deleteData = {
        password: 'password123'
      };

      const response = await request(app)
        .delete(`/accounts/${testAccount._id}`)
        .send(deleteData)
        .expect(204);

      // For 204 responses, body should be empty
      expect(Object.keys(response.body)).toHaveLength(0);

      // Verify only the target account was deleted
      const deletedAccount = await Account.findById(testAccount._id);
      expect(deletedAccount).toBeNull();

      const existingAccount2 = await Account.findById(account2._id);
      expect(existingAccount2).toBeTruthy();

      const existingAccount3 = await Account.findById(account3._id);
      expect(existingAccount3).toBeTruthy();
    });
  });
});
