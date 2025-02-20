const { Schema, model } = require('mongoose');

const accountSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  password: { type: String },
  email: { type: String },
  website: { type: String },
  company: { type: String },
  phone: { type: String },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  // messages: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Message'
  //   }
  // ]
});

module.exports = model('Account', accountSchema);