const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  message: {
    type: String,
    maxlength: 1000
  },
  title: {
    type: String,
    maxlength: 50
  },
  receiver_id: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  sender_id: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  created_at: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  updated_at: {
    type: Date,
    default: () => Date.now()
  },
});

module.exports = model('Message', messageSchema);