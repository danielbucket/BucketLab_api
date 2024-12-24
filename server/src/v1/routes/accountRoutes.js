const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const cors = require('cors')

router.get('/account', accountController.GET_account)
router.get('/account/:id', accountController.GET_accountById)
router.put('/account/:id', accountController.PUT_account)
router.delete('/account/:id', accountController.DEL_account)
router.post('/account/register',
  cors({
  methods: ['POST'],
}),
accountController.POST_register)

module.exports = router