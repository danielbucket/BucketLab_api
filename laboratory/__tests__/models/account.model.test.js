const mongoose = require('mongoose');
const Account = require('../../src/v1/models/account.model');

describe('Account Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid account with required fields', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const account = new Account(accountData);
      const savedAccount = await account.save();

      expect(savedAccount._id).toBeDefined();
      expect(savedAccount.first_name).toBe('John');
      expect(savedAccount.last_name).toBe('Doe');
      expect(savedAccount.email).toBe('john.doe@example.com');
      expect(savedAccount.password).toBe('password123');
      expect(savedAccount.permissions).toBe('user'); // default value
      expect(savedAccount.logged_in).toBe(false); // default value
      expect(savedAccount.login_count).toBe(0); // default value
      expect(savedAccount.messages).toEqual([]); // default empty array
    });

    it('should fail validation when required fields are missing', async () => {
      const account = new Account({
        first_name: 'John'
      });

      let error;
      try {
        await account.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.last_name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should fail validation with invalid email', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'not-an-email',
        password: 'password123'
      };

      const account = new Account(accountData);

      let error;
      try {
        await account.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    it('should fail validation with password too short', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: '123'
      };

      const account = new Account(accountData);

      let error;
      try {
        await account.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should fail validation with password too long', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'a'.repeat(25) // 25 characters, max is 24
      };

      const account = new Account(accountData);

      let error;
      try {
        await account.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should convert email to lowercase', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'JOHN.DOE@EXAMPLE.COM',
        password: 'password123'
      };

      const account = new Account(accountData);
      const savedAccount = await account.save();

      expect(savedAccount.email).toBe('john.doe@example.com');
    });

    it('should validate URL for website field', async () => {
      const validAccountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        website: 'https://johndoe.com'
      };

      const account = new Account(validAccountData);
      const savedAccount = await account.save();

      expect(savedAccount.website).toBe('https://johndoe.com');

      // Test invalid URL
      const invalidAccountData = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
        website: 'not-a-url'
      };

      const invalidAccount = new Account(invalidAccountData);

      let error;
      try {
        await invalidAccount.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.website).toBeDefined();
    });

    it('should handle permissions enum correctly', async () => {
      const userData = {
        first_name: 'User',
        last_name: 'Test',
        email: 'user@example.com',
        password: 'password123',
        permissions: 'user'
      };

      const adminData = {
        first_name: 'Admin',
        last_name: 'Test',
        email: 'admin@example.com',
        password: 'password123',
        permissions: 'admin'
      };

      const superAdminData = {
        first_name: 'SuperAdmin',
        last_name: 'Test',
        email: 'superadmin@example.com',
        password: 'password123',
        permissions: 'superadmin'
      };

      const userAccount = await new Account(userData).save();
      const adminAccount = await new Account(adminData).save();
      const superAdminAccount = await new Account(superAdminData).save();

      expect(userAccount.permissions).toBe('user');
      expect(adminAccount.permissions).toBe('admin');
      expect(superAdminAccount.permissions).toBe('superadmin');

      // Test invalid permission
      const invalidData = {
        first_name: 'Invalid',
        last_name: 'Test',
        email: 'invalid@example.com',
        password: 'password123',
        permissions: 'invalid_permission'
      };

      const invalidAccount = new Account(invalidData);

      let error;
      try {
        await invalidAccount.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    it('should handle mixed phone field type', async () => {
      const stringPhoneData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.string@example.com',
        password: 'password123',
        phone: '555-123-4567'
      };

      const numberPhoneData = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.number@example.com',
        password: 'password123',
        phone: 5551234567
      };

      const stringAccount = await new Account(stringPhoneData).save();
      const numberAccount = await new Account(numberPhoneData).save();

      expect(stringAccount.phone).toBe('555-123-4567');
      expect(numberAccount.phone).toBe('5551234567'); // Mongoose may convert to string
    });

    it('should enforce unique email constraint', async () => {
      const accountData1 = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      const accountData2 = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'duplicate@example.com',
        password: 'password456'
      };

      await new Account(accountData1).save();

      let error;
      try {
        await new Account(accountData2).save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    });

    it('should handle messages array properly', async () => {
      const messageId1 = new mongoose.Types.ObjectId();
      const messageId2 = new mongoose.Types.ObjectId();

      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.messages@example.com',
        password: 'password123',
        messages: [messageId1, messageId2]
      };

      const account = new Account(accountData);
      const savedAccount = await account.save();

      expect(savedAccount.messages).toHaveLength(2);
      expect(savedAccount.messages[0]).toEqual(messageId1);
      expect(savedAccount.messages[1]).toEqual(messageId2);
    });
  });

  describe('Default Values', () => {
    it('should set default values correctly', async () => {
      const accountData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.defaults@example.com',
        password: 'password123'
      };

      const account = new Account(accountData);
      const savedAccount = await account.save();

      expect(savedAccount.permissions).toBe('user');
      expect(savedAccount.logged_in).toBe(false);
      expect(savedAccount.logged_in_at).toBeNull();
      expect(savedAccount.last_logout_at).toBeNull();
      expect(savedAccount.login_count).toBe(0);
      expect(savedAccount.messages).toEqual([]);
      expect(savedAccount.created_at).toBeInstanceOf(Date);
      expect(savedAccount.updated_at).toBeInstanceOf(Date);
    });
  });
});
