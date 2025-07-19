const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Message = require('../../models/message.model');
const Traveler = require('../../models/traveler.model');

const MONGO_URI = process.env.MONGO_URI;

exports.getAllMessages = async (req, res) => {
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
};

exports.getMessageByID = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', (err) => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.',
      data: { err }
    });
  });

  const doc = await Message.findById({ _id: id });

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
  };
};

exports.createMessage = async (req, res) => {
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
    const sender = await Traveler.findById({ _id: req.body.sender_id });
    const receiver = await Traveler.findById({ _id: req.body.receiver_id });
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

exports.updateMessage = async (req, res) => {
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

exports.deleteMessage = async (req, res) => {
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

exports.getMessagesBySenderID = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', (err) => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.',
      data: err
    });
  });

  const messages = await Message.find({ sender_id: id });

  if (!messages) {
    return res.status(404).json({
      status: 'fail',
      message: 'No messages found with that sender ID.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      data: messages
    });
  };
};

exports.getMessagesByReceiverID = async (req, res) => {
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