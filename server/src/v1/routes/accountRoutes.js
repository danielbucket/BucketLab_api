const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const cors = require('cors')
const postConfig = { methods: ['POST'] }
const deleteConfig = { methods: ['DELETE'] }

router.delete('/account/:id',
  cors(deleteConfig),
  accountController.deleteAccount
)

router.post('/account/login',
  cors(postConfig),
  accountController.verifyAccountExists,
  accountController.accountLogin
)

router.post('/account/register',
  cors(postConfig),
  accountController.registerNewAccount
)

module.exports = router