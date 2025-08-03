const dotenv = require('dotenv');
dotenv.config({ path: './auth.env' });
const app = require('./src/v1/app.js');
const PORT = process.env.PORT || 4021;

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});