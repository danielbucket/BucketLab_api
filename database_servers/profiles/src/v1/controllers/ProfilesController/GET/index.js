const { getProfileByToken } = require('./getProfileByToken');
const { getAvatar } = require('./getAvatar');
const { getAllProfiles } = require('./getAllProfiles');

module.exports = Object.freeze(
  Object.assign({},
    { getProfileByToken },
    { getAvatar },
    { getAllProfiles }
  )
);