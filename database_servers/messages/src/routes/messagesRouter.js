const router = require('express').Router();
const cors = require('cors');
const { POST, PATCH, DELETE, GET } = require('../controllers/MessagesController/index.js');

router.route('/')
  .get(cors(), GET.getAllMessages)
  .post(cors(), POST.newMessage);
  
router.route('/me')
  .get(cors(), GET.getMessageByToken);

router.route('/:id')
  .get(cors(), GET.getMessageByMessageId)
  .patch(cors(), PATCH.updateMessageByMessageId)
  .delete(cors(), DELETE.deleteMessageByMessageId);

router.route('/login')
  .post(cors(), POST.loginMessage);

router.route('/logout/:id')
  .post(cors(), POST.logoutMessageByMessageId);

router.route('/unsecureMessageById/:id')
  .get(cors(), GET.getMessageByMessageId);


module.exports = router;