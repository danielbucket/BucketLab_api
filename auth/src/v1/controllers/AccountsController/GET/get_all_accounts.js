const Account = require('../../../models/account.model');

exports.get_all_accounts = async (req, res) => {
  try {
    const found = await Account.find({});

    if (!found || found.length === 0) {
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
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed.',
      error: error.message
    });
  }
};