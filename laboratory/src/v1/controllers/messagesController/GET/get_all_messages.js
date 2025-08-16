const Message = require('../../../models/message.model');

exports.get_all_messages = async (req, res) => {
  try {
    const docs = await Message.find({});

    return res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error retrieving messages.',
      data: error.message
    });
  }
};

