const express = require('express');
const cors = require('cors');

const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { POST, PATCH, DELETE, GET } = messagesController;

router.route('/')
  .get(cors(), GET.get_all_messages)
  .post(cors(), POST.new_message);

router.route('/sender/:id')
  .get(cors(), GET.get_messages_by_sender_id);

router.route('/receiver/:id')
  .get(cors(), GET.get_messages_by_receiver_id);

router.route('/message/:id')
  .get(cors(), GET.get_message_by_message_id);

router.route('/delete/:id')
  .delete(cors(), DELETE.delete_message_by_message_id);

router.route('/update/:id')
  .patch(cors(), PATCH.update_message_by_message_id);

module.exports = router;