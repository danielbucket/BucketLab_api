const Message = require('../../../models/message.model.js');
const mongoose = require('mongoose');

exports.getMessageByMessageId = async (req, res) => {
  const id = req.params.id;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid message ID format'
      });
    }

    const doc = await Message.findById(id);

    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No message found with that ID.'
      });
    } else {
      return res.status(200).json({
        status: 'success',
        data: { doc }
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error retrieving message.',
      data: error.message
    });
  }
};