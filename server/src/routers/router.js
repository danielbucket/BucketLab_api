const express = require('express')
const router = express.Router()
const user_controller = require('../controllers/user_controller.js')
const cors = require('cors')

router.get('/user', user_controller.GET_user)

router.post('/user/register', cors({
  methods: ['POST'],
}), user_controller.POST_register)


module.exports = router