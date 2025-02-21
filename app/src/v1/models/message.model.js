const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  message: { type: String },
  title: { type: String },
  receiver_id: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
  },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = model('Message', messageSchema);