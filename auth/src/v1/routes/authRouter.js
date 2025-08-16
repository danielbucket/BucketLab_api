const router = require('express').Router();
const cors = require('cors');
const { POST, PATCH, DELETE, GET } = require('../controllers/AccountsController');

router.route('/')
  .get(cors(), GET.getAllAccounts)
  .post(cors(), POST.newAccount);

router.route('/:id')
  .get(cors(), GET.getAccountByAccountId)
  .patch(cors(), PATCH.updateAccountByAccountId)
  .delete(cors(), DELETE.deleteAccountByAccountId);

router.route('/login')
  .post(cors(), POST.loginAccount);

router.route('/logout/:id')
  .post(cors(), POST.logoutAccountByAccountId);

module.exports = router;