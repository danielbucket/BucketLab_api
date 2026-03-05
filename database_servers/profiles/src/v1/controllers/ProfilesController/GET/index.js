const { getAllProfiles } = require('./getAllProfiles');
const { getProfileByProfileId } = require('./getProfileByProfileId');
const { getProfileByToken } = require('./getProfileByToken');
const { getAvatar } = require('./getAvatar');

module.exports = Object.freeze(
  Object.assign({},
    { getAllProfiles },
    { getProfileByProfileId },
    { getProfileByToken },
    { getAvatar }
  )
);