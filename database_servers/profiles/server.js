const ProfilesServer = require('./src/v1/app.js');
const database = require('./src/v1/database/index.js');
const { initializeDirectories } = require('./src/v1/utils/initialize.js');
const PORT = 4021;

// Initialize directories needed for the application
initializeDirectories();

// Initialize database connection
database.connect()
  .then(() => {
    ProfilesServer.listen(PORT, () => {
      console.log(`BucketLab Profiles Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });