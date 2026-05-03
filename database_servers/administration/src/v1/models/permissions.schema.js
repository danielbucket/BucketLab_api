const { Schema } = require('mongoose');
const { permissionsList } = require('../utils/permissionsList.js');

exports.requestedPermissionsSchema = new Schema({
  _id: false,
  name: {
    type: String,
    required: true,
    enum: permissionsList
  },
  requested_by: {
    type: Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  },
  request_status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  update_history: [
    {
      status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected']
      },
      updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
      },
      updated_at: {
        type: Date,
        default: () => new Date().toISOString()
      }
    }
  ],
  created_at: {
    type: Date,
    immutable: true,
    default: () => new Date().toISOString()
  }
}, { _id: false });
