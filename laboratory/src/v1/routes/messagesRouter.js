const cors = require('cors');

const { DELETE, GET, PATCH, POST } = require('../controllers/MessagesController'); 

const messagesRouter = require('express').Router();

messagesRouter.route('/')
  .get(cors(), GET.getAllMessages)
  .post(cors(), POST.newMessage);

messagesRouter.route('/sender/:id')
  .get(cors(), GET.getMessagesBySenderId);

messagesRouter.route('/receiver/:id')
  .get(cors(), GET.getMessagesByReceiverId);

messagesRouter.route('/message/:id')
  .get(cors(), GET.getMessageByMessageId);

messagesRouter.route('/delete/:id')
  .delete(cors(), DELETE.deleteMessageByMessageId);

messagesRouter.route('/update/:id')
  .patch(cors(), PATCH.updateMessageByMessageId);

module.exports = messagesRouter;