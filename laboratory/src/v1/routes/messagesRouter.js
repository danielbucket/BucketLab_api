const cors = require('cors');

const { DELETE_, GET_, PATCH_, POST_ } = require('../controllers/MessagesController'); 

const messagesRouter = require('express').Router();

messagesRouter.route('/')
  .get(cors(), GET_.get_all_messages)
  .post(cors(), POST_.new_message);

messagesRouter.route('/sender/:id')
  .get(cors(), GET_.get_messages_by_sender_id);

messagesRouter.route('/receiver/:id')
  .get(cors(), GET_.get_messages_by_receiver_id);

messagesRouter.route('/message/:id')
  .get(cors(), GET_.get_message_by_message_id);

messagesRouter.route('/delete/:id')
  .delete(cors(), DELETE_.delete_message_by_message_id);

messagesRouter.route('/update/:id')
  .patch(cors(), PATCH_.update_message_by_message_id);

module.exports = messagesRouter;