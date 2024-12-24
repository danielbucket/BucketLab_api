const express = require('express')
const authRouter = express.Router()
const authController = require('../controllers/authController')
const middleware = require('../middleware/auth.js')

authRouter.post('/register', authController.register)
authRouter.post('/login', middleware.authToken, authController.login)

module.exports = authRouter