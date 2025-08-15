const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

const setupTestDB = async () => {
  try {
    console.log('🚀 Starting test database setup...');
    
    // Create an instance of "MongoMemoryServer" and automatically start the instance
    mongoServer = await MongoMemoryServer.create();
    
    // Get the URI
    const uri = mongoServer.getUri();
    console.log('📡 MongoDB Memory Server URI:', uri);
    
    // Connect to the memory server
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Test database connected successfully');
    console.log('🔗 Mongoose connection state:', mongoose.connection.readyState);
  } catch (error) {
    console.error('❌ Error setting up test database:', error);
    throw error;
  }
};

const teardownTestDB = async () => {
  try {
    console.log('🧹 Starting test database teardown...');
    
    // Disconnect from mongoose
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🔌 Mongoose disconnected');
    }
    
    // Stop the MongoMemoryServer
    if (mongoServer) {
      await mongoServer.stop();
      console.log('🛑 MongoDB Memory Server stopped');
    }
    
    console.log('✅ Test database disconnected');
  } catch (error) {
    console.error('❌ Error tearing down test database:', error);
  }
};

const clearTestDB = async () => {
  try {
    console.log('🧽 Clearing test database...');
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log('✅ Test database cleared');
  } catch (error) {
    console.error('❌ Error clearing test database:', error);
  }
};

// Global setup and teardown
beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await clearTestDB();
});

module.exports = {
  setupTestDB,
  teardownTestDB,
  clearTestDB
};
