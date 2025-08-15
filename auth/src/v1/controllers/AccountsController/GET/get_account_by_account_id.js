const Account = require('../../../models/account.model');

exports.get_account_by_account_id = async (req, res) => {
  const id = req.params.id;
  
  try {
    const doc = await Account.findById(id);

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
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed.',
      error: error.message
    });
  }
};