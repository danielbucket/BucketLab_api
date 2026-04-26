const GET_methods = require('./GET/index.js');
const POST_methods = require('./POST/index.js');

module.exports = Object.assign({},
  { GET: GET_methods },
  { POST: POST_methods }
);