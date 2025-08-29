const { getAllAccounts } = require('./getAllAccounts');
const { getAccountByAccountId } = require('./getAccountByAccountId');
const { getAccountByToken } = require('./getAccountByToken');

module.exports = Object.freeze(
  Object.assign({},
    { getAllAccounts },
    { getAccountByAccountId },
    { getAccountByToken }
  )
);