const express = require('express')
const router = express.Router()

const GET_bucketlab = require('./controllers/GET_controller.js')

router.get('/user:id', GET_bucketlab.getUserById)

module.exports = router