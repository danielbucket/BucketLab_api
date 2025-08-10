const POST_methods = require('./POST/index.js');
const PATCH_methods = require('./PATCH/index.js');
const DELETE_methods = require('./DELETE/index.js');
const GET_methods = require('./GET/index.js');

module.exports = Object.freeze(
  Object.assign({},
    { DELETE_: DELETE_methods },
    { GET_: GET_methods },
    { PATCH_: PATCH_methods },
    { POST_: POST_methods }
  )
);