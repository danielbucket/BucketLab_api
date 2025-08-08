const { Router } = require('express');
const POST_Controller = require('../controllers/POST_controller');
const GET_Controller = require('../controllers/GET_controller');
const DELETE_Controller = require('../controllers/DELETE_controller');
const PATCH_Controller = require('../controllers/PATCH_controller');

const router = Router();

router.post('/new', POST_Controller.new_account);
router.post('/login', POST_Controller.login_account);
router.post('/logout', POST_Controller.logout_account);

router.get('/', GET_Controller.get_all_accounts);
router.get('/:id', GET_Controller.get_account_by_account_id);

router.delete('/:id', DELETE_Controller.delete_account_by_account_id);

router.patch('/:id', PATCH_Controller.update_account_by_account_id);


module.exports = router;
