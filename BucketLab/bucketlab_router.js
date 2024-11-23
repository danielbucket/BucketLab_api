const express = require('express')
const router = express.Router()

const GET_controller = require('./controllers/GET_controller.js')
const POST_controller = require('./controllers/POST_controller.js')
const PUT_controller = require('./controllers/PUT_controller.js')
const DELETE_controller = require('./controllers/DELETE_controller.js')

router.get('/users', GET_controller.GET_allUsers)
router.get('/user/:id', GET_controller.GET_userById)

router.post('/users', POST_controller.POST_newUser)

router.put('/user/:id', PUT_controller.PUT_updateUser)

router.delete('/user/:id', DELETE_controller.DELETE_userById)


module.exports = router