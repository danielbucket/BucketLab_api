// Global test setup
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Setup before all tests
beforeAll(() => {
  console.log('🚀 Starting App Service test suite...');
  
  // Suppress console.log in tests unless explicitly needed
  if (process.env.NODE_ENV !== 'test-verbose') {
    console.log = jest.fn();
    console.error = jest.fn();
  }
});

// Cleanup after all tests
afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.log('✅ App Service test suite completed');
});

// Add custom matchers
expect.extend({
  toBeValidISODate(received) {
    const pass = !isNaN(Date.parse(received));
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid ISO date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid ISO date`,
        pass: false,
      };
    }
  },
});
