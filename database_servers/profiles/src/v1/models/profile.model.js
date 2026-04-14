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
    immutable: true
  },
  notes: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    validate: [isURL, 'Please enter a valid URL'],
  },
  company: {
    type: String,
    default: ''
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
  // this field is to be created after the profile is created in the profiles server, using the id returned from the authentication server when creating the auth record
  depends_on_auth: {
    type: Schema.Types.ObjectId,
    ref: 'auth',
    required: true,
    unique: true,
    immutable: true
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

const profile = model('profile', accountSchema);

module.exports = profile;