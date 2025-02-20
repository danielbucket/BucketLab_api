const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  message: {
    type: String,
    required: [true, 'Please provide a message']
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Please provide a sender']
  },
  receiver: {
    type: String,
    required: [true, 'Please provide a receiver']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Message', messageSchema);