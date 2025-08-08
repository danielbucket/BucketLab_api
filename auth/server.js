const BucketLabEmpireUltimateSupreme_AuthServer = require('./src/v1/app.js');
const PORT = 4021;

BucketLabEmpireUltimateSupreme_AuthServer.listen(PORT, () => {
  console.log(`BucketLab Empire Ultimate Supreme Auth_Server listening on port ${PORT}`);
});