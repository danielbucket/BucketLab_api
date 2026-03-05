# Auth Service Test Suite

This directory contains comprehensive tests for the BucketLab Auth Service. The test suite covers unit tests, integration tests, and performance tests to ensure the reliability and performance of the authentication system.

## Test Structure

```
__tests__/
├── setup.js                           # Test environment setup
├── utils/
│   └── testUtils.js                   # Common test utilities
├── models/
│   └── account.model.test.js          # Account model unit tests
├── controllers/
│   ├── post.controllers.test.js       # POST endpoints tests
│   ├── get.controllers.test.js        # GET endpoints tests
│   ├── patch.controllers.test.js      # PATCH endpoints tests
│   └── delete.controllers.test.js     # DELETE endpoints tests
├── routes/
│   └── authRouter.test.js             # Route integration tests
├── optimization/
│   └── corsConfig.test.js             # CORS configuration tests
├── integration/
│   └── auth.integration.test.js       # End-to-end integration tests
├── performance/
│   └── performance.test.js            # Load and performance tests
└── app.test.js                        # Main app configuration tests
```

## Running Tests

### Development (Watch Mode)

```bash
npm test
```

### CI/Production

```bash
npm run test:ci
```

### Silent Mode (No Output)

```bash
npm run test:silent
```

## Test Coverage

The test suite covers:

### Models (`account.model.test.js`)

- Schema validation
- Required field validation
- Data type validation
- Default values
- Unique constraints
- Custom validators (email, URL, enum)

### Controllers

#### POST Operations (`post.controllers.test.js`)

- **Create Account** (`new_account`)

  - Valid account creation
  - Missing required fields validation
  - Duplicate email handling
  - Database validation errors

- **Login** (`login_account`)

  - Successful login with valid credentials
  - Missing credentials validation
  - Account not found scenarios
  - Invalid password handling

- **Logout** (`logout_account_by_account_id`)
  - Successful logout
  - Invalid ID format handling
  - Account not found scenarios

#### GET Operations (`get.controllers.test.js`)

- **Get All Accounts** (`get_all_accounts`)

  - Return all accounts with proper structure
  - Handle empty database

- **Get Account by ID** (`get_account_by_account_id`)
  - Return specific account
  - Handle non-existent accounts
  - Handle invalid ID formats

#### PATCH Operations (`patch.controllers.test.js`)

- **Update Account** (`update_account_by_account_id`)
  - Successful updates (single and multiple fields)
  - Account not found handling
  - Empty/null value validation
  - Database validation during updates

#### DELETE Operations (`delete.controllers.test.js`)

- **Delete Account** (`delete_account_by_account_id`)
  - Successful deletion with correct password
  - Password validation
  - Account not found handling
  - Ensure only target account is deleted

### Routes (`authRouter.test.js`)

- Route mounting and structure
- CORS header handling
- Middleware integration
- Error handling
- JSON parsing

### Configuration (`corsConfig.test.js`)

- CORS configuration validation
- Origin, methods, and headers setup
- Docker container communication

### Application (`app.test.js`)

- Express app configuration
- Middleware setup
- Trust proxy configuration
- Error handling
- Security headers

### Integration Tests (`auth.integration.test.js`)

- Complete account lifecycle (create → login → update → logout → delete)
- Multi-user interactions
- Data integrity across operations
- Validation consistency
- Edge cases and error scenarios

### Performance Tests (`performance.test.js`)

- Concurrent operations handling
- Load testing with multiple accounts
- Memory usage monitoring
- Error handling under load
- Response time benchmarks

## Test Utilities (`testUtils.js`)

Common utilities for creating test data and assertions:

- `createTestAccount()` - Create individual test accounts
- `createTestAccounts()` - Create multiple test accounts
- `createLoggedInAccount()` - Create pre-logged-in accounts
- `generateUniqueEmail()` - Generate unique email addresses
- `accountTemplates` - Pre-defined account data templates
- `validateAccountStructure()` - Validate account object structure
- `cleanupTestAccounts()` - Clean up test data

## Test Database

Tests use MongoDB Memory Server for isolated testing:

- Fresh database instance for each test run
- No interference with development/production data
- Automatic cleanup after tests complete
- Fast in-memory operations

## Environment Setup

The test environment:

- Uses Node.js test environment
- Mocks console output to reduce noise
- Automatically connects to test database
- Cleans up after each test case

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- Text summary in terminal
- HTML report in `coverage/lcov-report/index.html`
- LCOV format for CI integration

## Performance Benchmarks

The performance tests establish benchmarks for:

- **Account Creation**: Should handle 10+ concurrent creations in < 5 seconds
- **Login Operations**: 5 concurrent logins in < 3 seconds
- **Mixed Operations**: 20 mixed operations in < 10 seconds
- **Database Queries**: Retrieve 50 accounts in < 2 seconds
- **Response Times**: Average < 100ms per request
- **Memory Usage**: < 50MB increase during load testing

## Error Scenarios Tested

- Database connection issues
- Invalid data validation
- Duplicate data handling
- Not found scenarios
- Authentication failures
- Malformed request bodies
- Invalid ID formats
- Missing required fields
- Concurrent operation conflicts

## Best Practices

The test suite follows these practices:

- **Isolation**: Each test is independent
- **Cleanup**: Database is cleaned between tests
- **Coverage**: All code paths are tested
- **Performance**: Response times are monitored
- **Reliability**: Tests are deterministic
- **Documentation**: Clear test descriptions
- **Error Handling**: Both success and failure cases

## Adding New Tests

When adding new features:

1. **Unit Tests**: Test individual functions/methods
2. **Integration Tests**: Test feature end-to-end
3. **Error Cases**: Test all failure scenarios
4. **Performance**: Add load tests for new endpoints
5. **Documentation**: Update this README

## CI/CD Integration

For continuous integration:

- Use `npm run test:ci` for single test run with coverage
- Tests must pass before deployment
- Coverage reports can be sent to coverage services
- Performance benchmarks help identify regressions
