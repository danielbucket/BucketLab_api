const Account = require('../../src/v1/models/account.model');

describe('Account Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid account with required fields', async () => {
      const validAccount = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const account = new Account(validAccount);
      const savedAccount = await account.save();

      expect(savedAccount.first_name).toBe('John');
      expect(savedAccount.last_name).toBe('Doe');
      expect(savedAccount.email).toBe('john.doe@example.com');
      expect(savedAccount.password).toBe('password123');
      expect(savedAccount.permissions).toBe('user');
      expect(savedAccount.logged_in).toBe(false);
      expect(savedAccount.login_count).toBe(0);
      expect(savedAccount.created_at).toBeDefined();
      expect(savedAccount.updated_at).toBeDefined();
    });

    it('should fail validation when required fields are missing', async () => {
      const invalidAccount = new Account({
        first_name: 'John'
        // Missing last_name, email, password
      });

      await expect(invalidAccount.save()).rejects.toThrow();
    });

    it('should fail validation with invalid email', async () => {
      const invalidAccount = new Account({
        first_name: 'John',
        last_name: 'Doe',
        email: 'invalid-email',
        password: 'password123'
      });

      await expect(invalidAccount.save()).rejects.toThrow();
    });

    it('should fail validation with password too short', async () => {
      const invalidAccount = new Account({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: '123' // Too short
      });

      await expect(invalidAccount.save()).rejects.toThrow();
    });

    it('should fail validation with password too long', async () => {
      const invalidAccount = new Account({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'a'.repeat(25) // Too long
      });

      await expect(invalidAccount.save()).rejects.toThrow();
    });

    it('should convert email to lowercase', async () => {
      const account = new Account({
        first_name: 'John',
        last_name: 'Doe',
        email: 'JOHN.DOE@EXAMPLE.COM',
        password: 'password123'
      });

      const savedAccount = await account.save();
      expect(savedAccount.email).toBe('john.doe@example.com');
    });

    it('should validate URL for website field', async () => {
      const accountWithValidURL = new Account({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        website: 'https://www.example.com'
      });

      const savedAccount = await accountWithValidURL.save();
      expect(savedAccount.website).toBe('https://www.example.com');

      const accountWithInvalidURL = new Account({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        website: 'not-a-valid-url'
      });

      await expect(accountWithInvalidURL.save()).rejects.toThrow();
    });

    it('should handle permissions enum correctly', async () => {
      const adminAccount = new Account({
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: 'password123',
        permissions: 'admin'
      });

      const savedAccount = await adminAccount.save();
      expect(savedAccount.permissions).toBe('admin');

      const invalidPermissionAccount = new Account({
        first_name: 'Invalid',
        last_name: 'User',
        email: 'invalid@example.com',
        password: 'password123',
        permissions: 'invalid_permission'
      });

      await expect(invalidPermissionAccount.save()).rejects.toThrow();
    });

    it('should handle mixed phone field type', async () => {
      const accountWithStringPhone = new Account({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john1@example.com',
        password: 'password123',
        phone: '+1-555-123-4567'
      });

      const savedAccount1 = await accountWithStringPhone.save();
      expect(savedAccount1.phone).toBe('+1-555-123-4567');

      const accountWithNumberPhone = new Account({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane1@example.com',
        password: 'password123',
        phone: 5551234567
      });

      const savedAccount2 = await accountWithNumberPhone.save();
      expect(savedAccount2.phone).toBe(5551234567);
    });

    it('should enforce unique email constraint', async () => {
      const account1 = new Account({
        first_name: 'John',
        last_name: 'Doe',
        email: 'duplicate@example.com',
        password: 'password123'
      });

      await account1.save();

      const account2 = new Account({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'duplicate@example.com',
        password: 'password456'
      });

      await expect(account2.save()).rejects.toThrow();
    });
  });

  describe('Default Values', () => {
    it('should set default values correctly', async () => {
      const account = new Account({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.default@example.com',
        password: 'password123'
      });

      const savedAccount = await account.save();
      
      expect(savedAccount.permissions).toBe('user');
      expect(savedAccount.logged_in).toBe(false);
      expect(savedAccount.login_count).toBe(0);
      expect(savedAccount.phone).toBeNull();
      expect(savedAccount.logged_in_at).toBeNull();
      expect(savedAccount.last_logout_at).toBeNull();
      expect(savedAccount.created_at).toBeDefined();
      expect(savedAccount.updated_at).toBeDefined();
    });
  });
});
