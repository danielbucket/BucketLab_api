const { getAllAccounts } = require('./getAllAccounts');
const { getAccountByAccountId } = require('./getAccountByAccountId');

module.exports = Object.freeze(
  Object.assign({},
    { getAllAccounts },
    { getAccountByAccountId }
  )
);