const router = require('express').Router();
const { POST_, PATCH_, DELETE_, GET_ } = require('../controllers/MessagesController');

router.route('/')
  .get(GET_.get_all_messages)
  .post(POST_.new_message);

router.route('/sender/:id')
  .get(GET_.get_messages_by_sender_id);

router.route('/receiver/:id')
  .get(GET_.get_messages_by_receiver_id);

router.route('/message/:id')
  .get(GET_.get_message_by_message_id);

router.route('/delete/:id')
  .delete(DELETE_.delete_message_by_message_id);

router.route('/update/:id')
  .patch(PATCH_.update_message_by_message_id);

module.exports = router;