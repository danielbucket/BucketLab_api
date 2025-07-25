const dotenv = require('dotenv');
dotenv.config({ path: './laboratory.env' });
const app = require('./src/v1/app.js');
const PORT = process.env.PORT || 4420;

app.listen(PORT, () => {
  console.log(`BucketLab Laboratory Server is running on port: ${PORT}`);
});