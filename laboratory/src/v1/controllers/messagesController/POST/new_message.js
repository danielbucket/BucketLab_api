const mongoose = require('mongoose');
const Message = require('../../../models/message.model');
const Account = require('../../../models/account.model');

exports.new_message = async (req, res) => {
  for(let requiredParameter of ['message', 'title', 'receiver_id', 'sender_id']) {  
    if (req.body[requiredParameter] === undefined || req.body[requiredParameter] === null) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}`
      });
    }
  }

  try {
    // Validate ObjectId format for sender_id and receiver_id
    if (!mongoose.Types.ObjectId.isValid(req.body.sender_id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Message validation failed.',
        data: 'Invalid sender_id format'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.receiver_id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Message validation failed.',
        data: 'Invalid receiver_id format'
      });
    }

    // Check if sender exists
    const sender = await Account.findById(req.body.sender_id);
    if (!sender) {
      return res.status(404).json({
        status: 'error',
        message: 'Sender account not found.'
      });
    }

    // Check if receiver exists
    const receiver = await Account.findById(req.body.receiver_id);
    if (!receiver) {
      return res.status(404).json({
        status: 'error',
        message: 'Receiver account not found.'
      });
    }

    const doc = new Message({...req.body });
    const saved = await doc.save();

    sender.messages.push(saved._id);
    receiver.messages.push(saved._id);

    await sender.save();
    await receiver.save();

    return res.status(201).json({
      status: 'success',
      data: saved
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: 'error',
        message: 'Duplicate key error.',
        data: err.message
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Message validation failed.',
        data: err.message
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error creating message.',
      data: err.message
    });
  }
};