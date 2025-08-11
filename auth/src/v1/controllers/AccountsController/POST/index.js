const login_account = require('./login_account');
const logout_account_by_account_id = require('./logout_account_by_account_id.js');
const new_account = require('./new_account.js');

module.exports = Object.freeze(
  Object.assign({},
    login_account,
    logout_account_by_account_id,
    new_account
  )
);