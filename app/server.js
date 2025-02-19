const dotenv = require('dotenv')
const app = require('./src/v1/app.js');
const PORT = process.env.PORT || 4020;

dotenv.config({ path: './config.env' });

app.listen(PORT, () => {
  console.log(`BucketLab Server is running on port: ${PORT}`);
});