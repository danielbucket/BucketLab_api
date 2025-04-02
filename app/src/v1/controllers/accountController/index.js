const { deleteAccount } = require('./DELETE');
const { createAccount } = require('./POST');
const { getAllAccounts } = require('./GET');
const { getAccountByID } = require('./GET');
const { updateAccount } = require('./PATCH');
const { accountLogin } = require('./POST');
const { accountLogout } = require('./PATCH');

module.exports = {
  deleteAccount,
  createAccount,
  getAllAccounts,
  getAccountByID,
  updateAccount,
  accountLogin,
  accountLogout,
};