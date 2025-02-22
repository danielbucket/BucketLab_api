const { Schema, model } = require('mongoose');

const accountSchema = new Schema({
  first_name: {
    // When a string is passed, no error is thrown.
    // When a number is passed, no error is thrown. Why?
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 24,
    validate: {
      validator: (v) => {
        // return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/.test(v);
      },
      message: props => `${props.value} is not a valid password.`
    }
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  website: String,
  company: String,
  phone: String || Number,
  created_at: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }],
});

module.exports = model('Account', accountSchema);