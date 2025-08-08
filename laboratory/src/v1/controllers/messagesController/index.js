const { delete_message_by_message_id } = require('./DELETE/delete_message_by_message_id');
const { get_all_messages } = require('./GET/get_all_messages');
const { get_message_by_message_id } = require('./GET/get_message_by_message_id');
const { get_messages_by_receiver_id } = require('./GET/get_messages_by_receiver_id');
const { get_messages_by_sender_id } = require('./GET/get_messages_by_sender_id');
const { new_message } = require('./POST/new_message');
const { update_message_by_message_id } = require('./PATCH/update_message_by_message_id');

module.exports = {
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
};