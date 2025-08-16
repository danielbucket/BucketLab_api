const Message = require('../../../models/message.model.js');
const mongoose = require('mongoose');

exports.getMessagesBySenderId = async (req, res) => {
  const id = req.params.id;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid sender ID format'
      });
    }

    const docs = await Message.find({ sender_id: id });

    if (!docs || docs.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No messages found with that sender ID.'
      });
    } else {
      return res.status(200).json({
        status: 'success',
        data: docs
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error retrieving messages.',
      data: error.message
    });
  }
};