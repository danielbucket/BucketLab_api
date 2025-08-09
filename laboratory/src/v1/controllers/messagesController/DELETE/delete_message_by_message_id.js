const mongoose = require('mongoose');
const Message = require('../../../models/message.model');
const MONGO_URI = process.env.MONGO_URI;

exports.delete_message_by_message_id = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', (err) => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.',
      data: err
    });
  });

  const doc = await Message.findById({ _id: id });

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No message found with that ID.'
    });
  };

  const deleted = await doc.deleteOne();

  if (!deleted) {
    return res.status(500).json({
      status: 'error',
      message: 'Message deletion failed.'
    });
  } else {
    return res.status(204).json({
      status: 'success',
      data: null
    });
  };
};