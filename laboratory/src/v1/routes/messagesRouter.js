const messagesRouter = require('express').Router();
const cors = require('cors');
const MessagesController = require('../controllers/MessagesController/');

messagesRouter.route('/')
  .get(cors(), MessagesController.getAllMessages)
//   .post(cors(), MessagesController.createMessage);

// messagesRouter.route('/sender/:id')
//   .get(cors(), MessagesController.getMessagesBySenderId);

// messagesRouter.route('/receiver/:id')
//   .get(cors(), MessagesController.getMessagesByReceiverId);

// messagesRouter.route('/message/:id')
//   .get(cors(), MessagesController.getMessageById);

// messagesRouter.route('/delete/:id')
//   .delete(cors(), MessagesController.deleteMessageById);

// messagesRouter.route('/update/:id')
//   .patch(cors(), MessagesController.updateMessageById);

module.exports = messagesRouter;