const get_all_messages = require('./get_all_messages');
const get_message_by_message_id = require('./get_message_by_message_id');
const get_message_by_receiver_id = require('./get_messages_by_receiver_id');
const get_message_by_sender_id = require('./get_messages_by_sender_id');

module.exports = {
  get_all_messages,
  get_message_by_message_id,
  get_message_by_receiver_id,
  get_message_by_sender_id
};