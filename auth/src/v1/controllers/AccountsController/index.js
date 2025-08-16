const POST_methods = require('./POST');
const PATCH_methods = require('./PATCH');
const DELETE_methods = require('./DELETE');
const GET_methods = require('./GET');

module.exports = Object.freeze(
  Object.assign({},
    { DELETE: DELETE_methods },
    { GET: GET_methods },
    { PATCH: PATCH_methods },
    { POST: POST_methods }
  )
);