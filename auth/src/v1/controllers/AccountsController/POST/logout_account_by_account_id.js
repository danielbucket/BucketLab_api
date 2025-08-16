const { ObjectId } = require('mongodb');
const Account = require('../../../models/account.model');

exports.logoutAccountByAccountId = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(422).json({
      status: 'error',
      message: 'Invalid ID format.'
    });
  }

  try {
    const doc = await Account.findById(id);

    if (!doc) {
      return res.status(404).json({
        id,
        status: 'fail',
        message: 'No account found with that ID.'
      });
    }

    doc.logged_in = false;
    doc.logged_in_at = null;
    doc.last_logout_at = new Date().toISOString();

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
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed.',
      error: error.message
    });
  }
};