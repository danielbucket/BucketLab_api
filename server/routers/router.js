const express = require('express')
const router = express.Router()
const user_controller = require('../controllers/user_controller.js')

router.get('/user', user_controller.GET_user)

module.exports = router