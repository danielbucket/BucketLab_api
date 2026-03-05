const { updateAccountByAccountId } = require('./updateAccountByAccountId.js');
const { uploadAvatar } = require('../POST/uploadAvatar.js');

module.exports = Object.freeze(
  Object.assign({},
    { updateAccountByAccountId },
    { uploadAvatar }
  )
);