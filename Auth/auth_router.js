const express = require('express')
const authrouter = express.Router()

const loginController = require('./controllers/Login/Login_GET_controller')

authrouter.get('/login', loginController.GET_controller)
authrouter.post('/login', loginController.POST_controller)

module.exports = authrouter