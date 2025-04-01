const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const { default: isURL } = require('validator/lib/isURL');

const accountSchema = new Schema({
  first_name: {
    // When a string is passed, no error is thrown.
    // When a number is passed, no error is thrown. Why?
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 24,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email address'],
  },
  website: {
    type: String,
    validate: [isURL, 'Please enter a valid URL'],
  },
  company: String,
  phone: String || Number,
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }],
  permissions: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  logged_in: {
    type: Boolean,
    default: false
  },
  logged_in_at: {
    type: Date,
    default: null
  },
  last_logout_at: {
    type: Date,
    default: null
  },
  login_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  updated_at: {
    type: Date,
    default: () => Date.now()
  }
});

module.exports = model('Account', accountSchema);