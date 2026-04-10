const { updateProfile  } = require('./updateProfile.js');
const { uploadAvatar } = require('../POST/uploadAvatar.js');

module.exports = Object.freeze(
  Object.assign({},
    { updateProfile },
    { uploadAvatar }
  )
);