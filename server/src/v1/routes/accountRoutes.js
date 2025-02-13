const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');
const cors = require('cors');
const postConfig = { methods: ['POST'] };
const deleteConfig = { methods: ['DELETE'] };

router.delete('/account/delete/:id',
  authMiddleware.validateToken,
  cors(deleteConfig),
  accountController.deleteAccount
);

router.post('/account/login',
  cors(postConfig),
  authMiddleware.validateToken,
  accountController.accountLogin
);

router.post('/account/logout',
  cors(postConfig),
  accountController.accountLogout
);

router.post('/account/create',
  cors(postConfig),
  accountController.createNewAccount
);

module.exports = router;