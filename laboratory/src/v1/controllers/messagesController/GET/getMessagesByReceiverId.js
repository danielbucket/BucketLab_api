const Message = require('../../../models/message.model.js');
const mongoose = require('mongoose');

exports.getMessagesByReceiverId = async (req, res) => {
  const id = req.params.id;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid receiver ID format'
      });
    }

    const docs = await Message.find({ receiver_id: id });

    if (!docs || docs.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No messages found with that receiver ID.'
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