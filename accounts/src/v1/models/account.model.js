const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const { default: isURL } = require('validator/lib/isURL');

const accountSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  website: {
    type: String,
    validate: [isURL, 'Please enter a valid URL'],
  },
  company: {
    type: String,
    // default: ''
  },
  phone: {
    type: Schema.Types.Mixed, // Allows for various phone formats, including numbers and strings
    default: null
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }],
  avatar_id: {
    type: Schema.Types.ObjectId,
    ref: 'Avatar',
    default: null
  },
  permissions: {
    type: [String],
    enum: ['user', 'admin', 'superadmin', 'guest'],
    default: ['guest']
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


const bcrypt = require('bcrypt');

// Pre-save hook to hash password if modified
accountSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

const Account = model('Account', accountSchema);

module.exports = Account;