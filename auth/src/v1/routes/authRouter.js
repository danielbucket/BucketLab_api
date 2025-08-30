const router = require('express').Router();
const cors = require('cors');
const { POST, PATCH, DELETE, GET } = require('../controllers/AccountsController');
const { authenticateToken } = require('../middleware/jwtAuth.js');

router.route('/')
  .get(cors(), GET.getAllAccounts)
  .post(cors(), POST.newAccount);
  
router.route('/me')
  .get(cors(), authenticateToken, GET.getAccountByToken);

router.route('/:id')
  .get(cors(), GET.getAccountByAccountId)
  .patch(cors(), PATCH.updateAccountByAccountId)
  .delete(cors(), DELETE.deleteAccountByAccountId);

router.route('/login')
  .post(cors(),
    (req,res,next) => {
      console.log('Login attempt:', req.body.email);
      next();
    },
   POST.loginAccount);

router.route('/logout/:id')
  .post(cors(), POST.logoutAccountByAccountId);

module.exports = router;