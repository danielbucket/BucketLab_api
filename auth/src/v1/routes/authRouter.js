const router = require('express').Router();
const cors = require('cors');

const AccountsController = require('../controllers/AccountsController');
const { POST_, PATCH_, DELETE_, GET_ } = AccountsController;

router.route('/')
  .get(cors(), GET_.get_all_accounts)
  .post(cors(),
  (req, res, next) => {
    console.log('Accounts route middleware triggered.');
    console.log('New Account: ', new_account)
    next();
  },
  POST_.new_account);

router.route('/account/:id')
  .get(cors(), GET_.get_account_by_account_id)
  .patch(cors(), PATCH_.update_account_by_account_id)
  .delete(cors(), DELETE_.delete_account_by_account_id);

router.route('/login')
  .post(cors(), POST_.login_account);

router.route('/logout/:id')
  .post(cors(), POST_.logout_account_by_account_id);

module.exports = router;