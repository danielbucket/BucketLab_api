const { getPermissions } = require('./getPermissions.js');

module.exports = Object.assign({},
  { ...getPermissions }
);