const express = require('express')
const authRoutes = express.Router()
const authController = require('../controllers/authController/index.js')
const middleware = require('../middleware/auth.js')

authRoutes.post('/login', middleware.authToken, authController.login)

module.exports = authRoutes