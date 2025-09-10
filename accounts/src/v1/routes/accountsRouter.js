const router = require('express').Router();
const cors = require('cors');
const { POST, PATCH, DELETE, GET } = require('../controllers/AccountsController/index.js');
const { authorize } = require('../middleware/authorize.js');

router.route('/')
  .get(cors(), GET.getAllAccounts)
  .post(cors(), POST.newAccount);

// router.route('/avatar/:id')
  // .get(cors(), authorize, GET.getAccountAvatarById)
  // .patch(cors(), authorize, PATCH.updateAccountAvatarById)
  // .delete(cors(), authorize, DELETE.deleteAccountAvatarById);

router.route('/me')
  .get(cors(), authorize, GET.getAccountByToken);

router.route('/:id')
  .get(cors(), authorize, GET.getAccountByAccountId)
  .patch(cors(), authorize, PATCH.updateAccountByAccountId)
  .delete(cors(), authorize, DELETE.deleteAccountByAccountId);

router.route('/login')
  .post(cors(), POST.loginAccount);

router.route('/logout/:id')
  .post(cors(), POST.logoutAccountByAccountId);

module.exports = router;