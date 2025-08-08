const mongoose = require('mongoose');
const Message = require('../../../models/message.model');

const MONGO_URI = process.env.MONGO_URI;

exports.update_message_by_message_id = async (req, res) => {
  const id = req.params.id.slice(1);
  const { body } = req;

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

  // I'm thinking this isn't necessary when using mongoose schemas...
  Object.keys(body).forEach((key) => {
    if (doc[key]) {
      doc[key] = body[key];
    } else {
      return res.status(404).json({
        status: 'fail',
        message: `No property found with the key: ${key}`
      });
    };
  });

  doc.updated_at = Date.now();
  const saved = await doc.save();

  if (!saved) {
    return res.status(500).json({
      status: 'error',
      message: 'Message update failed.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      data: saved
    });
  };
};