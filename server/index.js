require('dotenv').config();

const server = require('./src/v1');
const PORT = process.env.PORT || 4020;

server.listen(PORT, () => {
  console.log(`BucketLab Server is running on port: ${PORT}`);
});