const Messages_Server = require('./src/v1/app.js');
const database = require('./src/v1/database/index.js');
const { initializeDirectories } = require('./src/v1/utils/initialize.js');
const PORT = 4022;

// Initialize directories needed for the application
initializeDirectories();

// Initialize database connection
database.connect()
  .then(() => {
    const server = Messages_Server.listen(PORT, () => {
      console.log(`BucketLab Messages Server listening on port ${PORT}`);
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