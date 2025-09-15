const { Schema, model } = require('mongoose');
const { isURL } = require('validator');

const avatarSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  avatar_data: {
    type: Buffer,
    required: true
  },
  content_type: {
    type: String,
    required: true
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  }
});

const Avatar = model('Avatar', avatarSchema);

module.exports = Avatar;