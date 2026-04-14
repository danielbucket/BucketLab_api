const { getProfileByToken } = require('./getProfileByToken');
const { getAvatar } = require('./getAvatar');

module.exports = Object.freeze(
  Object.assign({},
    { getProfileByToken },
    { getAvatar }
  )
);