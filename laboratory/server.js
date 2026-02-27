const BucketLabEmpireUltimateSupreme_LaboratoryServer = require('./src/v1/app.js');
const database = require('./src/v1/database');
const PORT = 4420;

// Initialize database connection
database.connect()
  .then(() => {
    BucketLabEmpireUltimateSupreme_LaboratoryServer.listen(PORT, () => {
      console.log(`BucketLab Empire Ultimate Supreme Laboratory Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });