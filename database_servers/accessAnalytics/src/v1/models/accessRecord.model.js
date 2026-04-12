const { Schema, model } = require('mongoose');

const accessRecordSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  resource: {
    type: String,
    required: [true, 'Resource is required']
  },
  originData: {
    type: Object,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  depends_on_auth_record: {
    type: Schema.Types.ObjectId,
    ref: 'AuthRecord',
    default: null
  },
  created_at: {
    type: Date,
    immutable: true,
    default: () => new Date().toISOString()
  },
});

const AccessRecordModel = model('AccessRecord', accessRecordSchema);

AccessRecordModel.createAccessRecord = async function(userId, accessType, resource) {
  const newRecord = new this({
    userId,
    accessType,
    resource
  });
  return await newRecord.save();
};

module.exports = AccessRecordModel;