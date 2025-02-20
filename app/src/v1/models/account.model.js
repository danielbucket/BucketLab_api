const { Schema, model } = require('mongoose');

const accountSchema = new Schema({
  first_name: {
    type: String,
    required: [true, 'Please provide your first name']
  },
  last_name: {
    type: String,
    required: [true, 'Please provide your last name']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email']
  },
  website: {
    type: String,
    required: [false, '']
  },
  company: {
    type: String,
    required: [false, '']
  },
  phone: {
    type: String,
    required: [false, '']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  // messages: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Message'
  //   }
  // ]
});

module.exports = model('Account', accountSchema);