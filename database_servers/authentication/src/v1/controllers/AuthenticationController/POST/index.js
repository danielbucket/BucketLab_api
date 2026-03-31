const { loginAuthorization } = require('./loginAuthorization.js');
const { createAuthentication } = require('./createAuthentication.js');
const { logout } = require('./logout.js');

module.exports = Object.assign({},
  { loginAuthorization },
  { createAuthentication },
  { logout }
);