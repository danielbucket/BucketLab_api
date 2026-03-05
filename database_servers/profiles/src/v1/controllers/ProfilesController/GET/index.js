const { getAllAccounts } = require('./getAllAccounts');
const { getAccountByAccountId } = require('./getAccountByAccountId');
const { getAccountByToken } = require('./getAccountByToken');
const { getAvatar } = require('./getAvatar');

module.exports = Object.freeze(
  Object.assign({},
    { getAllAccounts },
    { getAccountByAccountId },
    { getAccountByToken },
    { getAvatar }
  )
);