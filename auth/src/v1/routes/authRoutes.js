const { Router } = require('express');
const router = Router();

const POST_Controller = require('../controllers/POST_controller');
const GET_Controller = require('../controllers/GET_controller');
const DELETE_Controller = require('../controllers/DELETE_controller');
const PATCH_Controller = require('../controllers/PATCH_controller');

router.route('/accounts')
  .get(GET_Controller.get_all_accounts)
  .post(POST_Controller.new_account);

router.route('/accounts/:id')
  .get(GET_Controller.get_account_by_account_id)
  .patch(PATCH_Controller.update_account_by_account_id)
  .delete(DELETE_Controller.delete_account_by_account_id);

router.route('/accounts/login')
  .post(POST_Controller.login_account);

router.route('/accounts/logout')
  .post(POST_Controller.logout_account);

router.route('/accounts/:id')
  .delete(DELETE_Controller.delete_account_by_account_id)
  .patch(PATCH_Controller.update_account_by_account_id);

module.exports = router;