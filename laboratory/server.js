const BucketLabEmpireUltimateSupreme_LaboratoryServer = require('./src/v1/app.js');
const PORT = 4420;

BucketLabEmpireUltimateSupreme_LaboratoryServer.listen(PORT, () => {
  console.log(`BucketLab Empire Ultimate Supreme Laboratory_Server is running on port: ${PORT}`);
});