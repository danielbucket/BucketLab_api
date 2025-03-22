const express = require('express');
const cors = require('cors');

const {
  deleteAccount,
  createAccount,
  getAllAccounts,
  getAccountByID,
  updateAccount,
  accountLogin,
  accountLogout,
} = require('../controllers/accountController');
const { validateToken, checkID } = require('../middleware/authMiddleware');

const router = express.Router();
const getConfig = { methods: ['GET'] };
const postConfig = { methods: ['POST'] };
const patchConfig = { methods: ['PATCH'] };
const deleteConfig = { methods: ['DELETE'] };

router.param('id', checkID);

router.route('/')
  .get(cors(getConfig), getAllAccounts)
  .post(cors(postConfig), createAccount);

router.route('/login')
    .post(cors(postConfig), accountLogin);
    
router.route('/logout/:id')
  .patch(cors(patchConfig), accountLogout);

router.route('/:id')
  .get(cors(postConfig), getAccountByID)
  .patch(cors(patchConfig), updateAccount)
  .delete(cors(deleteConfig), deleteAccount);

module.exports = router;