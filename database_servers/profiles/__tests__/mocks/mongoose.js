const mongoose = require('mongoose');

// Store the original connect method
const originalConnect = mongoose.connect;

// Mock mongoose.connect to prevent controllers from creating new connections
mongoose.connect = jest.fn().mockImplementation((uri, options) => {
  // If we're already connected, just return the existing connection
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve();
  }
  
  // Otherwise, use the original connect method
  return originalConnect.call(mongoose, uri, options);
});

// Export mongoose with the mocked connect method
module.exports = mongoose;
