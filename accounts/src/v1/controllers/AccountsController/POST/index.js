const loginAccount = require('./loginAccount.js');
const logoutAccountByAccountId = require('./logoutAccountByAccountId.js');
const newAccount = require('./newAccount.js');

module.exports = Object.freeze(
  Object.assign({},
    loginAccount,
    logoutAccountByAccountId,
    newAccount
  )
);