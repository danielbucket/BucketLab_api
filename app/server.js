const BucketLab_API_Server = require('./src/v1/app.js');
const PORT = 4020;

BucketLab_API_Server.listen(PORT, () => {
  console.log(`BucketLab API Server is running on port: ${PORT}`);
});