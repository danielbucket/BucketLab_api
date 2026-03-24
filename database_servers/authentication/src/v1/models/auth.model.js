const bcrypt = require('bcrypt');
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
  JWT_token: {
    type: String,
    default: null
  },

  // This should be immutable, but only after its been set once,
  // because we need to set it when creating the authentication document,
  // and it should be based on the profile id that is created in the profiles server.
  // So we can't set it as immutable right away, but we can enforce that it can't be
  // changed after it's been set.
  depends_on_profile: {
    type: Schema.Types.ObjectId,
    required: false,
    unique: true,
    sparse: true, // Allows multiple null values without violating unique constraint
    immutable: function() {
      // If depends_on_profile is already set, make it immutable
      return !!this.depends_on_profile;
    }
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

// Pre-save hook to hash the password before saving the auth document
authSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);

      next();
    } catch (err) {
      console.error('Error hashing password:', err);
      next(err);
    }
  } else {
    console.log('Password not modified, skipping hash');
    next();
  }
});
const auth = model('auth', authSchema);

module.exports = auth;