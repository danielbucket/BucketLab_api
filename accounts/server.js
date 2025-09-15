const BucketLabEmpireUltimateSupreme_AccountsServer = require('./src/v1/app.js');
const database = require('./src/v1/database');
const { initializeDirectories } = require('./src/v1/utils/initialize');
const PORT = 4021;

// Initialize directories needed for the application
initializeDirectories();

// Initialize database connection
database.connect()
  .then(() => {
    BucketLabEmpireUltimateSupreme_AccountsServer.listen(PORT, () => {
      console.log(`BucketLab Empire Ultimate Supreme Accounts_Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });