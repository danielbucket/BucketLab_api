const router = require('express').Router();
const cors = require('cors');
const { authorize } = require('../middleware/authorize.js');
const { POST, PATCH, DELETE, GET } = require('../controllers/AccountsController/index.js');

router.route('/avatar/upload/:id')
  .post(cors(), authorize, POST.uploadAvatar);

router.route('/avatar/:id')
  .delete(cors(), authorize, DELETE.deleteAvatar)
  .get(cors(), GET.getAvatar);

router.route('/')
  .get(cors(), GET.getAllAccounts)
  .post(cors(), POST.newAccount);
  
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