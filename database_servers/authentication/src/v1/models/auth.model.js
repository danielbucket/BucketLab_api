const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');

const authSchema = new Schema({
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
  permissions: {
    type: [String],
    enum: ['user', 'admin', 'superadmin', 'guest'],
    default: ['guest']
  },
  depends_on_profile: {
    type: Schema.Types.ObjectId,
    ref: 'profile',
    required: true,
    unique: true,
    immutable: true
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
  created_at: {
    type: Date,
    immutable: true,
    default: () => new Date().toISOString()
  },
  updated_at: {
    type: Date,
    default: () => new Date().toISOString()
  }
});

const bcrypt = require('bcrypt');

// Pre-save hook to hash the password before saving the auth document
authSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});
const auth = model('auth', authSchema);

module.exports = auth;