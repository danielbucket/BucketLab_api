const router = require('express').Router();
const cors = require('cors');
const { POST_, PATCH_, DELETE_, GET_ } = require('../controllers/MessagesController');

router.route('/')
  .get(cors(), GET_.get_all_messages)
  .post(cors(), POST_.new_message);

router.route('/sender/:id')
  .get(cors(), GET_.get_messages_by_sender_id);

router.route('/receiver/:id')
  .get(cors(), GET_.get_messages_by_receiver_id);

router.route('/message/:id')
  .get(cors(), GET_.get_message_by_message_id);

router.route('/delete/:id')
  .delete(cors(), DELETE_.delete_message_by_message_id);

router.route('/update/:id')
  .patch(cors(), PATCH_.update_message_by_message_id);

module.exports = router;