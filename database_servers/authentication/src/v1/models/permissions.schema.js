const { Schema } = require('mongoose');
const { permissionsList } = require('../utils/permissionsList.js');

// Embedded permissions schema - for use within other documents
exports.embeddedPermissionsSchema = new Schema({
  _id: false,
  name: {
    type: String,
    required: true,
    enum: permissionsList
  },
  approval_status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  created_at: {
    type: Date,
    immutable: true,
    default: () => new Date().toISOString()
  }
}, { _id: false });