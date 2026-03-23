const { loginAuthorization } = require('./loginAuthorization.js');
const { createAuthentication } = require('./createAuthentication.js');
// const { refreshTokenAuthorization } = require('./refreshTokenAuthorization.js');
// const { logoutAuthorizationByProfileId } = require('./logoutAuthorizationByProfileId.js');

module.exports = Object.assign({},
  { loginAuthorization },
  { createAuthentication },
  // { refreshTokenAuthorization },
  // { logoutAuthorizationByProfileId }
);