const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Account = require('../../models/account.model');

const MONGO_URI = process.env.MONGO_URI;

exports.getAllAccounts = async (req, res) => {
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  const found = await Account.find({});
  
  if (!found) {
    return res.status(404).json({
      status: 'fail',
      message: 'No accounts found.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      results: found.length,
      data: { found }
    });
  };
};

exports.getAccountByID = async (req, res) => {
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
      status: 'fail',
      message: 'No account found with that ID.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      data: { doc }
    });
  };
};