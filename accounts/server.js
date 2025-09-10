const BucketLabEmpireUltimateSupreme_AccountsServer = require('./src/v1/app.js');
const database = require('./src/v1/database');
const PORT = 4021;

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