const { getAllProfiles } = require('./getAllProfiles');
const { getProfileByToken } = require('./getProfileByToken');
const { getAvatar } = require('./getAvatar');

module.exports = Object.freeze(
  Object.assign({},
    { getAllProfiles },
    { getProfileByToken },
    { getAvatar }
  )
);