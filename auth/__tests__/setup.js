const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;
let originalConnect;

beforeAll(async () => {
  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Start MongoDB Memory Server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Set the environment variable so controllers can use it
  process.env.MONGO_URI = uri;
  
  // Store original connect method
  originalConnect = mongoose.connect;
  
  // Mock mongoose.connect to prevent multiple connections during tests
  mongoose.connect = jest.fn().mockImplementation((connectUri, options) => {
    // If already connected, just return resolved promise
    if (mongoose.connection.readyState === 1) {
      return Promise.resolve();
    }
    // Otherwise connect to our test database (remove deprecated options)
    return originalConnect.call(mongoose, uri);
  });

  // Initial connection (remove deprecated options)
  await mongoose.connect(uri);

  // Ensure connection is established
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Failed to establish MongoDB connection for tests');
  }
}, 30000);

afterEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.warn('Error cleaning up collections:', error);
  }
}, 30000);

afterAll(async () => {
  // Restore original connect method
  if (originalConnect) {
    mongoose.connect = originalConnect;
  }
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
  // Clean up environment variable
  delete process.env.MONGO_URI;
}, 30000);

// Mock console methods to reduce noise during testing
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
