const BucketLabEmpireUltimateSupreme_AppServer = require('./src/v1/app.js');
const PORT = 4020;

BucketLabEmpireUltimateSupreme_AppServer.listen(PORT, () => {
  console.log(`BucketLab Empire Ultimate Supreme App Server is running on port: ${PORT}`);
});