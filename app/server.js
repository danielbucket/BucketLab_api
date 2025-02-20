const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
const app = require('./src/v1/app.js');
const PORT = process.env.PORT || 4020;


app.listen(PORT, () => {
  console.log(`BucketLab Server is running on port: ${PORT}`);
});