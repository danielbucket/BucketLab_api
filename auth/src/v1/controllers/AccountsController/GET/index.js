const { getAllAccounts } = require('./get_all_accounts');
const { getAccountByAccountId } = require('./get_account_by_account_id');

module.exports = Object.freeze(
  Object.assign({},
    { getAllAccounts },
    { getAccountByAccountId }
  )
);