const { deleteProfileByProfileId } = require('./deleteProfileByProfileId.js');
const { deleteAvatar } = require('./deleteAvatar.js');

module.exports = Object.freeze(
  Object.assign({},
    { deleteProfileByProfileId },
    { deleteAvatar }
  )
);