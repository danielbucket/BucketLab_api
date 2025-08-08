const mongoose = require('mongoose');
const Message = require('../../../../models/message.model');
const Account = require('../../../../models/account.model');

const MONGO_URI = process.env.MONGO_URI;

exports.new_message = async (req, res) => {
  for(let requiredParameter of ['message', 'title', 'receiver_id', 'sender_id']) {  
    if (!req.body[requiredParameter]) {
      return res.status(422).json({
        status: 'fail',
        message: `Missing required parameter: ${requiredParameter}`
      });
    };
  };

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', (err) => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.',
      data: err
    });
  });

  const doc = new Message({...req.body });
  const saved = await doc.save();

  try {
    const sender = await Account.findById({ _id: req.body.sender_id });
    const receiver = await Account.findById({ _id: req.body.receiver_id });
    
    if (!sender || !receiver) {
      return res.status(404).json({
        status: 'fail',
        message: 'No account found with that sender ID or receiver ID.'
      });
    };

    sender.messages.push(saved._id);
    receiver.messages.push(saved._id);

    await sender.save();
    await receiver.save();

    return res.status(201).json({
      status: 'success',
      data: saved
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Error saving message.',
      data: err
    });
  };
};