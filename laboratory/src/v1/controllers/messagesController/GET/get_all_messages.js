const mongoose = require('mongoose');
const Message = require('../../../models/message.model');
const MONGO_URI = process.env.MONGO_URI;

exports.get_all_messages = async (req, res) => {
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', (err) => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.',
      data: { err }
    });
  });
  
  const docs = await Message.find({});

  if (!docs) {
    return res.status(404).json({
      status: 'fail',
      message: 'No messages found.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs
    });
  };

  return res.status(200).json({
    status: 'success',
    message: 'This is a placeholder response for get_all_messages.'
  });
};

