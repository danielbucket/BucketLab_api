const cors = require('cors');

const { DELETE, GET, PATCH, POST } = require('../controllers/messagesController'); 

const messagesRouter = require('express').Router();

messagesRouter.route('/')
  .get(cors(), GET.get_all_messages)
  .post(cors(), POST.new_message);

messagesRouter.route('/sender/:id')
  .get(cors(), GET.get_messages_by_sender_id);

messagesRouter.route('/receiver/:id')
  .get(cors(), GET.get_messages_by_receiver_id);

messagesRouter.route('/message/:id')
  .get(cors(), GET.get_message_by_message_id);

messagesRouter.route('/delete/:id')
  .delete(cors(), DELETE.delete_message_by_message_id);

messagesRouter.route('/update/:id')
  .patch(cors(), PATCH.update_message_by_message_id);

module.exports = messagesRouter;