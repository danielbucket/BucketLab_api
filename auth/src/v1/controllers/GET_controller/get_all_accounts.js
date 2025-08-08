const mongoose = require('mongoose');
const Account = require('../../models/account.model');
const MONGO_URI = process.env.MONGO_URI;

exports.get_all_accounts = async (req, res) => {
  console.log('GET all accounts endpoint hit');
  
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

  return res.status(501).json({
    status: 'error',
    message: 'This endpoint is not implemented yet.'
  });
};