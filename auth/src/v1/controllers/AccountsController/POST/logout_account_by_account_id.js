const mongoose = require('mongoose');
const Account = require('../../../models/account.model');
const MONGO_URI = process.env.MONGO_URI;

exports.logout_account_by_account_id = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  if (!ObjectId.isValid(id)) {
    return res.status(422).json({
      status: 'error',
      message: 'Invalid ID format.'
    });
  };

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