const { loginAuthorization } = require('./loginAuthorization.js');
const { registerAuthorization } = require('./registerAuthorization.js');
// const { refreshTokenAuthorization } = require('./refreshTokenAuthorization.js');
// const { logoutAuthorizationByProfileId } = require('./logoutAuthorizationByProfileId.js');

module.exports = Object.assign({},
  { loginAuthorization },
  { registerAuthorization },
  // { refreshTokenAuthorization },
  // { logoutAuthorizationByProfileId }
);