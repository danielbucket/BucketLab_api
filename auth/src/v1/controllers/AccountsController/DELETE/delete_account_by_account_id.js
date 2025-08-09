const mongoose = require('mongoose');
const Account = require('../../../models/account.model');

const MONGO_URI = process.env.MONGO_URI;

exports.delete_account_by_account_id = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', (err) => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.',
      err
    });
  });

  const doc = await Account.findById({ _id: id });

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No account found with that ID.'
    });
  };
  
  const deleted = await doc.deleteOne();

  if (!deleted) {
    return res.status(500).json({
      status: 'error',
      message: 'Account deletion failed.'
    });
  } else {
    return res.status(204).json({
      status: 'success',
      data: null
    });
  };
};