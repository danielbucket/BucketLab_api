const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');
const { requestedPermissionsSchema } = require('./permissions.schema.js'); 

const adminSchema = new Schema({
  // Singleton constraint: ensures only one admin instance exists
  _singleton: {
    type: Boolean,
    immutable: true,
    default: true
  },
  // The profile that initiated/owns this Administration singleton
  // Must have 'empire' permission to create the singleton
  initiated_by_profile: {
    type: Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: 'Profile'
  },
  requested_permissions: {
    type: [requestedPermissionsSchema],
    default: []
  },
  depends_on_profile: {
    type: Schema.Types.ObjectId,
    required: false,
    sparse: true,
    immutable: function() {
      return !!this.depends_on_profile;
    },
    ref: 'Auth'
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

// Enforce singleton: only one admin instance allowed
adminSchema.index({ _singleton: 1 }, { unique: true });

const Administration = model('Administration', adminSchema);

// Static method to initialize singleton instance (only called once)
Administration.initializeSingleton = async function(profileId, initiatorPassword, overridePassword) {
  try {
    // Check if singleton already exists - if so, deny creation
    const existingSingleton = await this.findOne({ _singleton: true });
    if (existingSingleton) {
      const error = new Error('Administration singleton has already been initialized. No additional singletons can be created.');
      error.status = 409; // Conflict
      throw error;
    }

    // Validate the initiator password against ADMIN_INIT_PASSWORD from .env
    const expectedPassword = process.env.ADMIN_INIT_PASSWORD;
    if (!expectedPassword) {
      const error = new Error('ADMIN_INIT_PASSWORD is not configured in environment variables.');
      error.status = 500; // Server error
      throw error;
    }

    if (initiatorPassword !== expectedPassword) {
      const error = new Error('Invalid initiator password. Cannot create Administration singleton.');
      error.status = 401; // Unauthorized
      throw error;
    }

    // Create the singleton with the initiating profile
    const admin = new this({
      _singleton: true,
      initiated_by_profile: profileId,
      email: 'administrator@bucketlab.io',
      password: overridePassword || 'temp_admin_password_change_required'
    });

    await admin.save();
    return admin;
  } catch (error) {
    console.error('Error initializing Administration singleton:', error.message);
    throw error;
  }
};

// Static method to get singleton instance (read-only)
Administration.getSingleton = async function() {
  return this.findOne({ _singleton: true }).populate('initiated_by_profile');
};

module.exports = Administration;