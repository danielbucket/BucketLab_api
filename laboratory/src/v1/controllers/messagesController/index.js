const { delete_message_by_message_id } = require('./DELETE');
const {
  get_all_messages,
  get_message_by_message_id,
  get_messages_by_receiver_id,
  get_messages_by_sender_id
} = require('./GET');
const { new_message } = require('./POST');
const { update_message_by_message_id } = require('./PATCH');

module.exports = Object.freeze({
  POST: {
    new_message
  },
  PATCH: {
    update_message_by_message_id
  },
  DELETE: {
    delete_message_by_message_id
  },
  GET: {
    get_all_messages,
    get_message_by_message_id,
    get_messages_by_receiver_id,
    get_messages_by_sender_id
  }
});