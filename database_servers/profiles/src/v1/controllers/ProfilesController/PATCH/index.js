const { updateProfileByProfileToken  } = require('./updateProfileByProfileToken.js');
const { uploadAvatar } = require('../POST/uploadAvatar.js');

module.exports = Object.freeze(
  Object.assign({},
    { updateProfileByProfileToken },
    { uploadAvatar }
  )
);