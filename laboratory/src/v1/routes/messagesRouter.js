const cors = require('cors');

const { DELETE_methods, GET_methods, PATCH_methods, POST_methods } = require('../controllers/MessagesController'); 

const messagesRouter = require('express').Router();

messagesRouter.route('/')
  .get(cors(), GET_methods.getAllMessages)
  .post(cors(), POST_methods.newMessage);

messagesRouter.route('/sender/:id')
  .get(cors(), GET_methods.getMessagesBySenderId);

messagesRouter.route('/receiver/:id')
  .get(cors(), GET_methods.getMessagesByReceiverId);

messagesRouter.route('/message/:id')
  .get(cors(), GET_methods.getMessageByMessageId);

messagesRouter.route('/delete/:id')
  .delete(cors(), DELETE_methods.deleteMessageByMessageId);

messagesRouter.route('/update/:id')
  .patch(cors(), PATCH_methods.updateMessageByMessageId);

module.exports = messagesRouter;