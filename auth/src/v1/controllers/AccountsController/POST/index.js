const loginAccount = require('./loginAccount');
const logoutAccountByAccountId = require('./logoutAccountByAccountId.js');
const newAccount = require('./newAccount.js');

module.exports = Object.freeze(
  Object.assign({},
    loginAccount,
    logoutAccountByAccountId,
    newAccount
  )
);