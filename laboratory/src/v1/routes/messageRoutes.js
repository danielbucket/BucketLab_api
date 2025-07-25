const express = require('express');
const cors = require('cors');

const router = express.Router();

const messagesController = require('../controllers/messagesController');

router.route('/')
  .get(cors(), messagesController.getAllMessages);

module.exports = router;