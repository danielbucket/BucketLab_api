const Laboratory_Server = require('./src/v1/app.js');
const database = require('./src/v1/database/index.js');
const { initializeDirectories } = require('./src/v1/utils/initialize.js');
const PORT = 4023;

// Initialize directories needed for the application
initializeDirectories();

// Initialize database connection
// This method ensures that the server only starts listening after a
// successful database connection is established.
// This helps prevent race conditions and ensures that the server
// is fully operational before accepting requests.
database.connect()
  .then(() => {
    Laboratory_Server.listen(PORT, () => {
      console.log(`BucketLab Laboratory Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });