const { deleteAccountByAccountId } = require('./deleteAccountByAccountId');
const { deleteAvatar } = require('./deleteAvatar');

module.exports = Object.freeze(
  Object.assign({},
    { deleteAccountByAccountId },
    { deleteAvatar }
  )
);