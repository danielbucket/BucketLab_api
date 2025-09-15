const { updateAccountByAccountId } = require('./updateAccountByAccountId');
const { uploadAvatar } = require('../POST/uploadAvatar.js');

module.exports = Object.freeze(
  Object.assign({},
    { updateAccountByAccountId },
    { uploadAvatar }
  )
);