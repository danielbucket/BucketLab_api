const mongoose = require('mongoose');
const Message = require('../../../models/message.model');

const MONGO_URI = process.env.MONGO_URI;

exports.get_messages_by_receiver_id = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', (err) => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.',
      data: err
    });
  });

  const messages = await Message.find({ receiver_id: id });

  if (!messages) {
    return res.status(404).json({
      status: 'fail',
      message: 'No messages found with that receiver ID.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      data: messages
    });
  };
};