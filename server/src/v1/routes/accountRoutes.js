const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const accountMiddleware = require('../controllers/accountController/middleware.js')
const authMiddleware = require('../middleware/authMiddleware')
const cors = require('cors')
const postConfig = { methods: ['POST'] }
const deleteConfig = { methods: ['DELETE'] }

router.delete('/account/delete/:id',
  authMiddleware.validateToken,
  cors(deleteConfig),
  accountController.deleteAccount
)

router.post('/account/login',
  cors(postConfig),
  accountMiddleware.verifyAccountExists,
  accountController.accountLogin
)

router.post('/account/register',
  cors(postConfig),
  accountController.registerNewAccount
)

module.exports = router