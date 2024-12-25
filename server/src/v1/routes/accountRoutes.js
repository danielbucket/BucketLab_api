const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const cors = require('cors')

router.delete('/account/:id', accountController.DEL_account)



router.post('/account/login',
  accountController.verifyAccountExists,
  accountController.accountLogin
)


router.post('/account/register', cors({
  methods: ['POST'],
}), accountController.POST_register)

module.exports = router