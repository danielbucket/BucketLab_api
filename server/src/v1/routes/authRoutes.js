const express = require('express')
const authRoutes = express.Router()
const authController = require('../controllers/authController/index.js')
const authMiddleware = require('../middleware/authMiddleware.js')

// authRoutes.post('/login', authMiddleware.validateToken, authController.login)

module.exports = authRoutes