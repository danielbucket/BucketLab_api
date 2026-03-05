const { loginAccount } = require('./loginAccount.js');
const { logoutAccountByAccountId } = require('./logoutAccountByAccountId.js');
const { uploadAvatar } = require('./uploadAvatar.js');
const { newAccount } = require('./newAccount.js');

module.exports = Object.freeze(
  Object.assign({}, {
    loginAccount,
    logoutAccountByAccountId,
    uploadAvatar,
    newAccount
  })
);