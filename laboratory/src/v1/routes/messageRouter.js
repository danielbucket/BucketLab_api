const router = require('express').Router();
const cors = require('cors');
const MessagesController = require('../controllers/MessagesController');

router.route('/')
  .get(cors(), MessagesController.getAllMessages)
//   .post(cors(), MessagesController.createMessage);

// router.route('/sender/:id')
//   .get(cors(), MessagesController.getMessagesBySenderId);

// router.route('/receiver/:id')
//   .get(cors(), MessagesController.getMessagesByReceiverId);

// router.route('/message/:id')
//   .get(cors(), MessagesController.getMessageById);

// router.route('/delete/:id')
//   .delete(cors(), MessagesController.deleteMessageById);

// router.route('/update/:id')
//   .patch(cors(), MessagesController.updateMessageById);

module.exports = router;