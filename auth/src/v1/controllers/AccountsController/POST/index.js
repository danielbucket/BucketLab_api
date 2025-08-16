const loginAccount = require('./login_account');
const logoutAccountByAccountId = require('./logout_account_by_account_id.js');
const newAccount = require('./new_account.js');

module.exports = Object.freeze(
  Object.assign({},
    loginAccount,
    logoutAccountByAccountId,
    newAccount
  )
);