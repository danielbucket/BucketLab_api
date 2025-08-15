const { corsConfig } = require('../../src/v1/optimization/corsConfig');

describe('CORS Configuration', () => {
  describe('corsConfig function', () => {
    it('should return a valid CORS configuration object', () => {
      const config = corsConfig();

      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });

    it('should have correct origin configuration', () => {
      const config = corsConfig();

      expect(config.origin).toBe('http://app_server:4021');
    });

    it('should have correct allowed methods', () => {
      const config = corsConfig();

      expect(config.methods).toBeDefined();
      expect(Array.isArray(config.methods)).toBe(true);
      expect(config.methods).toContain('GET');
      expect(config.methods).toContain('POST');
      expect(config.methods).toContain('PUT');
      expect(config.methods).toContain('DELETE');
      expect(config.methods).toContain('PATCH');
      expect(config.methods.length).toBe(5);
    });

    it('should have correct allowed headers', () => {
      const config = corsConfig();

      expect(config.allowedHeaders).toBeDefined();
      expect(Array.isArray(config.allowedHeaders)).toBe(true);
      expect(config.allowedHeaders).toContain('Content-Type');
      expect(config.allowedHeaders).toContain('Authorization');
      expect(config.allowedHeaders.length).toBe(2);
    });

    it('should enable credentials', () => {
      const config = corsConfig();

      expect(config.credentials).toBe(true);
    });

    it('should have correct options success status for legacy browser support', () => {
      const config = corsConfig();

      expect(config.optionsSuccessStatus).toBe(200);
    });

    it('should return consistent configuration on multiple calls', () => {
      const config1 = corsConfig();
      const config2 = corsConfig();

      expect(config1).toEqual(config2);
    });
  });

  describe('CORS Configuration Properties', () => {
    let config;

    beforeEach(() => {
      config = corsConfig();
    });

    it('should have all required CORS properties', () => {
      const requiredProperties = [
        'origin',
        'methods',
        'allowedHeaders',
        'credentials',
        'optionsSuccessStatus'
      ];

      requiredProperties.forEach(prop => {
        expect(config).toHaveProperty(prop);
      });
    });

    it('should not have unexpected properties', () => {
      const expectedProperties = [
        'origin',
        'methods',
        'allowedHeaders',
        'credentials',
        'optionsSuccessStatus'
      ];

      const actualProperties = Object.keys(config);
      
      actualProperties.forEach(prop => {
        expect(expectedProperties).toContain(prop);
      });

      expect(actualProperties.length).toBe(expectedProperties.length);
    });
  });

  describe('CORS Configuration Values', () => {
    it('should support standard HTTP methods for RESTful API', () => {
      const config = corsConfig();
      const standardMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

      standardMethods.forEach(method => {
        expect(config.methods).toContain(method);
      });
    });

    it('should support common request headers', () => {
      const config = corsConfig();
      const commonHeaders = ['Content-Type', 'Authorization'];

      commonHeaders.forEach(header => {
        expect(config.allowedHeaders).toContain(header);
      });
    });

    it('should be configured for docker container communication', () => {
      const config = corsConfig();

      // The origin suggests this is configured for docker containers
      expect(config.origin).toMatch(/^http:\/\/app_server:\d+$/);
    });
  });
});
