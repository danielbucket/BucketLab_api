const Account = require('../../src/v1/models/account.model');

/**
 * Test utilities for Auth service tests
 */

/**
 * Create a test account with default or provided data
 */
const createTestAccount = async (overrides = {}) => {
  const defaultAccount = {
    first_name: 'Test',
    last_name: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    ...overrides
  };

  return await Account.create(defaultAccount);
};

/**
 * Create multiple test accounts
 */
const createTestAccounts = async (count = 3, baseData = {}) => {
  const accounts = [];
  
  for (let i = 0; i < count; i++) {
    const account = await createTestAccount({
      first_name: `User${i + 1}`,
      last_name: 'Test',
      email: `user${i + 1}@example.com`,
      ...baseData
    });
    accounts.push(account);
  }

  return accounts;
};

/**
 * Create a logged-in test account
 */
const createLoggedInAccount = async (overrides = {}) => {
  return await createTestAccount({
    logged_in: true,
    login_count: 1,
    logged_in_at: new Date().toISOString(),
    ...overrides
  });
};

/**
 * Wait for a specified amount of time (useful for async operations)
 */
const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate unique email for testing
 */
const generateUniqueEmail = (prefix = 'test') => {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}@example.com`;
};

/**
 * Common account data templates
 */
const accountTemplates = {
  basic: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123'
  },
  
  admin: {
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    password: 'adminpass123',
    permissions: 'admin'
  },
  
  complete: {
    first_name: 'Complete',
    last_name: 'User',
    email: 'complete@example.com',
    password: 'password123',
    website: 'https://example.com',
    company: 'Test Company',
    phone: '555-123-4567',
    permissions: 'user'
  }
};

/**
 * Extract specific fields from response body
 */
const extractFields = (obj, fields) => {
  const result = {};
  fields.forEach(field => {
    if (obj.hasOwnProperty(field)) {
      result[field] = obj[field];
    }
  });
  return result;
};

/**
 * Assert that an object has the expected structure
 */
const expectObjectStructure = (obj, expectedStructure) => {
  Object.keys(expectedStructure).forEach(key => {
    expect(obj).toHaveProperty(key);
    
    if (expectedStructure[key] !== null && typeof expectedStructure[key] === 'object') {
      expectObjectStructure(obj[key], expectedStructure[key]);
    } else if (expectedStructure[key] !== undefined) {
      expect(obj[key]).toBe(expectedStructure[key]);
    }
  });
};

/**
 * Clean up all test accounts (useful in afterAll hooks)
 */
const cleanupTestAccounts = async () => {
  await Account.deleteMany({});
};

/**
 * Validate that account data matches expected structure
 */
const validateAccountStructure = (account) => {
  const requiredFields = [
    '_id',
    'first_name',
    'last_name',
    'email',
    'password',
    'permissions',
    'logged_in',
    'login_count',
    'created_at',
    'updated_at'
  ];

  requiredFields.forEach(field => {
    expect(account).toHaveProperty(field);
  });

  expect(typeof account.first_name).toBe('string');
  expect(typeof account.last_name).toBe('string');
  expect(typeof account.email).toBe('string');
  expect(typeof account.password).toBe('string');
  expect(['user', 'admin', 'superadmin']).toContain(account.permissions);
  expect(typeof account.logged_in).toBe('boolean');
  expect(typeof account.login_count).toBe('number');
  expect(account.created_at).toBeInstanceOf(Date);
  expect(account.updated_at).toBeInstanceOf(Date);
};

module.exports = {
  createTestAccount,
  createTestAccounts,
  createLoggedInAccount,
  wait,
  generateUniqueEmail,
  accountTemplates,
  extractFields,
  expectObjectStructure,
  cleanupTestAccounts,
  validateAccountStructure
};
