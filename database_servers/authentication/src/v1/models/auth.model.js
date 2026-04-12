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
  depends_on_profile: {
    ref: 'Profile',
    type: Schema.Types.ObjectId,
    required: false,
    unique: true,
    sparse: true,
    immutable: function() {
      return !!this.depends_on_profile;
    }
  },
  access_records: [{
    type: Schema.Types.ObjectId,
    ref: 'AccessRecord',
    default: [],
    validate: {
      validator: function(value) {
        return Array.isArray(value);
      },
      message: 'Access records must be an array of ObjectIds'
    }
  }],
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