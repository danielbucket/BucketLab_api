const express = require('express');
const cors = require('cors');

const {
  deleteAccount,
  accountLogin,
  accountLogout,
  createAccount,
  getAllAccounts,
  getAccountByID,
  updateAccount,
  checkID,
} = require('../controllers/accountController');
const { validateToken } = require('../middleware/authMiddleware');

const router = express.Router();
const postConfig = { methods: ['POST'] };
const patchConfig = { methods: ['PATCH'] };
const deleteConfig = { methods: ['DELETE'] };

router.param('id', checkID);

router.route('/')
  .get(getAllAccounts)
  .post(cors(postConfig), createAccount);

router.route('/:id')
  .get(cors(postConfig), getAccountByID)
  .patch(cors(patchConfig), updateAccount)
  .delete(cors(deleteConfig), deleteAccount);

router.route('/login')
  .post(cors(postConfig), validateToken, accountLogin);

router.route('/logout')
  .post( cors(postConfig), accountLogout);

module.exports = router;