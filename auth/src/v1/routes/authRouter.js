const express = require('express');
const cors = require('cors');
const router = express.Router();

const AccountsController = require('../controllers/AccountsController');
const { POST, PATCH, DELETE, GET } = AccountsController;

router.route('/')
  .get(cors(), GET.get_all_accounts)
  .post(cors(), POST.new_account);

router.route('/account/:id')
  .get(cors(), GET.get_account_by_account_id)
  .patch(cors(), PATCH.update_account_by_account_id)
  .delete(cors(), DELETE.delete_account_by_account_id);

router.route('/login')
  .post(cors(), POST.login_account);

router.route('/logout/:id')
  .post(cors(), POST.logout_account_by_account_id);

module.exports = router;