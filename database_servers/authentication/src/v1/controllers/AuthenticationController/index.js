const POST_methods = require('./POST');
const DELETE_methods = require('./DELETE');

module.exports = Object.assign({},
  { POST: POST_methods },
  { DELETE: DELETE_methods }
);