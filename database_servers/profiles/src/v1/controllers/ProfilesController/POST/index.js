const { loginProfile } = require('./loginProfile.js');
const { logoutProfileByProfileId } = require('./logoutProfileByProfileId.js');
const { uploadAvatar } = require('./uploadAvatar.js');
const { createProfile } = require('./createProfile.js');

module.exports = Object.freeze(
  Object.assign({}, {
    loginProfile,
    logoutProfileByProfileId,
    uploadAvatar,
    createProfile
  })
);