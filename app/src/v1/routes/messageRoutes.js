const express = require('express');
const cors = require('cors');

const {
  createMessage,
  getAllMessages,
  getMessageByID,
  deleteMessage,
  updateMessage,
  getMessagesBySenderID,
  getMessagesByReceiverID
} = require('../controllers/messageController');
const { validateToken } = require('../middleware/authMiddleware');

const router = express.Router();
const getConfig = { methods: ['GET'] };
const postConfig = { methods: ['POST'] };
const patchConfig = { methods: ['PATCH'] };
const deleteConfig = { methods: ['DELETE'] };

router.route('/')
  .get(cors(getConfig), getAllMessages)
  .post(cors(postConfig), createMessage);

router.route('/:id/sender')
  .get(cors(getConfig), getMessagesBySenderID)

router.route('/:id/receiver')
  .get(cors(getConfig), getMessagesByReceiverID)

router.route('/:id')
  .get(cors(getConfig), getMessageByID)
  .patch(cors(patchConfig), updateMessage)
  .delete(cors(deleteConfig), deleteMessage);

  module.exports = router;