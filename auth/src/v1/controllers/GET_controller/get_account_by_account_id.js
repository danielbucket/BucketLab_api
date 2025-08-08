const mongoose = require('mongoose');
const Account = require('../../models/account.model');
const MONGO_URI = process.env.MONGO_URI;

exports.get_account_by_account_id = async (req, res) => {
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