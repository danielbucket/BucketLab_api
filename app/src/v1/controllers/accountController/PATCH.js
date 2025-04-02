const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Account = require('../../models/account.model');

const MONGO_URI = process.env.MONGO_URI;

exports.updateAccount = async (req, res) => {
  const id = req.params.id.slice(1);
  const { body } = req;
  
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });
  
  const doc = await Account.findById({ _id: id });

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No account found with that ID.'
    });
  };

  Object.keys(body).forEach((key) => {
    if (doc[key]) {
      doc[key] = body[key];
    } else {
      return res.status(404).json({
        status: 'fail',
        message: `The key: '${key}' cannot be updated.`
      });
    };
  });

  doc.updated_at = Date.now();
  const saved = await doc.save();
  
  if (!saved) {
    return res.status(500).json({
      status: 'error',
      message: 'Account update failed.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      data: { saved }
    });
  };
};

exports.accountLogout = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  const doc = await Account.findById({ _id: id });

  if (!doc) {
    return res.status(404).json({
      id,
      status: 'fail',
      message: 'No account found with that ID.'
    });
  };

  doc.logged_in = false;
  doc.logged_in_at = null;

  const saved = await doc.save();

  if (!saved) {
    return res.status(500).json({
      status: 'error',
      message: 'Document failed to save to the database.'
    });
  } else {
    return res.status(200).json({
      status: 'success'
    });
  };
};