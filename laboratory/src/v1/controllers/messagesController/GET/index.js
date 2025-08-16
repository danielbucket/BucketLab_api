const { getAllMessages } = require('./getAllMessages');
const { getMessageByMessageId } = require('./getMessageByMessageId');
const { getMessagesByReceiverId } = require('./getMessagesByReceiverId');
const { getMessagesBySenderId } = require('./getMessagesBySenderId');

module.exports = Object.freeze(
  Object.assign({},
    { getAllMessages },
    { getMessageByMessageId },
    { getMessagesByReceiverId },
    { getMessagesBySenderId }
  )
);