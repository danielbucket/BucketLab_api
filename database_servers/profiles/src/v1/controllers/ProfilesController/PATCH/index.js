const { updateProfileByProfileId } = require('./updateProfileByProfileId.js');
const { uploadAvatar } = require('../POST/uploadAvatar.js');

module.exports = Object.freeze(
  Object.assign({},
    { updateProfileByProfileId },
    { uploadAvatar }
  )
);