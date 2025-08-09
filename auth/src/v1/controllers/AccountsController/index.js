const { delete_account_by_account_id } = require('./DELETE');
const { get_account_by_account_id, get_all_accounts } = require('./GET');
const { update_account_by_account_id } = require('./PATCH');
const { login_account, logout_account_by_account_id, new_account } = require('./POST');

module.exports = Object.freeze({
  POST: {
    new_account,
    login_account,
    logout_account_by_account_id
  },
  PATCH: {
    update_account_by_account_id
  },
  DELETE: {
    delete_account_by_account_id
  },
  GET: {
    get_account_by_account_id,
    get_all_accounts
  }
});