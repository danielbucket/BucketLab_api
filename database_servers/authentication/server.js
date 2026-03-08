const Authentication_Server = require('./src/v1/app.js');
const database = require('./src/v1/database/index.js');
const { initializeDirectories } = require('./src/v1/utils/initialize.js');
const PORT = 4024;

// Initialize directories needed for the application
initializeDirectories();

// Initialize database connection
database.connect()
.then(() => {
  Authentication_Server.listen(PORT, () => {
    console.log(`BucketLab Authentication Server listening on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});