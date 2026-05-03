const app = require('./src/v1/app.js');
const database = require('./src/v1/database/index.js');
const { initializeDirectories } = require('./src/v1/utils/initialize.js');
const { SERVER_PORT } = require('./src/v1/config.js');

// Initialize directories needed for the application
initializeDirectories();

// Initialize database connection
database.connect()
.then(() => {
  const server = app.listen(SERVER_PORT, () => {
    console.log(`BucketLab Administration Server listening on port ${SERVER_PORT}`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
})
.catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});