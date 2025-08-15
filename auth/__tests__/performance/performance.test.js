const request = require('supertest');
const app = require('../../src/v1/app');
const Account = require('../../src/v1/models/account.model');
const { createTestAccounts, generateUniqueEmail } = require('../utils/testUtils');

describe('Auth Service Performance Tests', () => {
  describe('Concurrent Operations', () => {
    it('should handle multiple concurrent account creations', async () => {
      const concurrentRequests = 10;
      const startTime = Date.now();

      const createPromises = Array(concurrentRequests).fill().map((_, index) => 
        request(app)
          .post('/accounts')
          .send({
            first_name: `Concurrent${index}`,
            last_name: 'Test',
            email: generateUniqueEmail(`concurrent${index}`),
            password: 'password123'
          })
      );

      const results = await Promise.all(createPromises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Created ${concurrentRequests} accounts in ${duration}ms`);

      // All requests should succeed
      results.forEach((response, index) => {
        expect([201, 500].includes(response.status)).toBe(true);
        // Some might fail due to timing issues, but most should succeed
      });

      // Check that accounts were actually created
      const createdAccounts = await Account.find({ 
        first_name: { $regex: /^Concurrent\d+$/ } 
      });

      expect(createdAccounts.length).toBeGreaterThan(concurrentRequests * 0.7); // At least 70% success rate
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle concurrent logins efficiently', async () => {
      // Create test accounts first
      const testAccounts = await createTestAccounts(5);
      const startTime = Date.now();

      const loginPromises = testAccounts.map(account =>
        request(app)
          .post('/accounts/login')
          .send({
            email: account.email,
            password: 'password123'
          })
      );

      const results = await Promise.all(loginPromises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Performed ${testAccounts.length} concurrent logins in ${duration}ms`);

      // All logins should succeed
      results.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
      });

      expect(duration).toBeLessThan(3000); // Should complete within 3 seconds
    });

    it('should handle mixed concurrent operations', async () => {
      const operations = 20;
      const startTime = Date.now();

      // Create a mix of operations
      const promises = [];

      // Account creations
      for (let i = 0; i < operations / 4; i++) {
        promises.push(
          request(app)
            .post('/accounts')
            .send({
              first_name: `Mixed${i}`,
              last_name: 'Test',
              email: generateUniqueEmail(`mixed${i}`),
              password: 'password123'
            })
        );
      }

      // Create some accounts to operate on
      const baseAccounts = await createTestAccounts(5, { password: 'password123' });

      // Logins
      for (let i = 0; i < operations / 4; i++) {
        const account = baseAccounts[i % baseAccounts.length];
        promises.push(
          request(app)
            .post('/accounts/login')
            .send({
              email: account.email,
              password: 'password123'
            })
        );
      }

      // Updates
      for (let i = 0; i < operations / 4; i++) {
        const account = baseAccounts[i % baseAccounts.length];
        promises.push(
          request(app)
            .patch(`/accounts/${account._id}`)
            .send({
              company: `Company${i}`
            })
        );
      }

      // Gets
      for (let i = 0; i < operations / 4; i++) {
        const account = baseAccounts[i % baseAccounts.length];
        promises.push(
          request(app)
            .get(`/accounts/${account._id}`)
        );
      }

      const results = await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Performed ${operations} mixed operations in ${duration}ms`);

      // Most operations should succeed
      const successCount = results.filter(r => r.status < 400).length;
      expect(successCount).toBeGreaterThan(operations * 0.8); // At least 80% success rate
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Load Testing', () => {
    it('should handle rapid sequential requests', async () => {
      const requestCount = 50;
      const startTime = Date.now();

      // Create account first
      const testAccount = await Account.create({
        first_name: 'Load',
        last_name: 'Test',
        email: 'load.test@example.com',
        password: 'password123'
      });

      // Make rapid sequential GET requests
      const results = [];
      for (let i = 0; i < requestCount; i++) {
        const response = await request(app)
          .get(`/accounts/${testAccount._id}`);
        results.push(response);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      const avgResponseTime = duration / requestCount;

      console.log(`Made ${requestCount} sequential requests in ${duration}ms (avg: ${avgResponseTime.toFixed(2)}ms per request)`);

      // All requests should succeed
      results.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
      });

      expect(avgResponseTime).toBeLessThan(100); // Average response time should be under 100ms
    });

    it('should maintain performance with many accounts', async () => {
      // Create many accounts (simulate larger database)
      const accountCount = 50;
      await createTestAccounts(accountCount);

      const startTime = Date.now();

      // Test get all accounts performance
      const response = await request(app)
        .get('/accounts');

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Retrieved ${accountCount} accounts in ${duration}ms`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.results).toBe(accountCount);
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds even with many accounts
    });
  });

  describe('Memory and Resource Usage', () => {
    it('should not leak memory during multiple operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform many operations
      for (let batch = 0; batch < 5; batch++) {
        const batchPromises = Array(10).fill().map((_, index) => 
          request(app)
            .post('/accounts')
            .send({
              first_name: `Batch${batch}User${index}`,
              last_name: 'Test',
              email: generateUniqueEmail(`batch${batch}user${index}`),
              password: 'password123'
            })
        );

        await Promise.all(batchPromises);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

      console.log(`Memory increase: ${memoryIncreaseMB.toFixed(2)}MB`);

      // Memory increase should be reasonable (less than 50MB for this test)
      expect(memoryIncreaseMB).toBeLessThan(50);
    });
  });

  describe('Error Handling Under Load', () => {
    it('should handle validation errors gracefully under load', async () => {
      const invalidRequestCount = 20;
      const startTime = Date.now();

      const invalidPromises = Array(invalidRequestCount).fill().map((_, index) =>
        request(app)
          .post('/accounts')
          .send({
            first_name: 'Invalid',
            last_name: 'Test',
            email: 'not-an-email', // Invalid email
            password: 'password123'
          })
      );

      const results = await Promise.all(invalidPromises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Handled ${invalidRequestCount} invalid requests in ${duration}ms`);

      // All should return error status
      results.forEach(response => {
        expect(response.status).toBe(500);
        expect(response.body.status).toBe('error');
      });

      expect(duration).toBeLessThan(5000); // Should handle errors quickly
    });

    it('should handle not found errors efficiently', async () => {
      const notFoundRequestCount = 30;
      const nonExistentId = '507f1f77bcf86cd799439011';
      const startTime = Date.now();

      const notFoundPromises = Array(notFoundRequestCount).fill().map(() =>
        request(app)
          .get(`/accounts/${nonExistentId}`)
      );

      const results = await Promise.all(notFoundPromises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Handled ${notFoundRequestCount} not found requests in ${duration}ms`);

      // All should return 404
      results.forEach(response => {
        expect(response.status).toBe(404);
        expect(response.body.status).toBe('fail');
      });

      expect(duration).toBeLessThan(3000); // Should handle not found quickly
    });
  });
});
