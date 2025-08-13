const POST_methods = require('./POST');
const PATCH_methods = require('./PATCH');
const DELETE_methods = require('./DELETE');
const GET_methods = require('./GET');

module.exports = Object.freeze(
  Object.assign({},
    { DELETE_: DELETE_methods },
    { GET_: GET_methods },
    { PATCH_: PATCH_methods },
    { POST_: POST_methods }
  )
);