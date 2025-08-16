const Account = require('../../../models/account.model');

exports.deleteAccountByAccountId = async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;

  try {
    const doc = await Account.findById(id);

    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No account found with that ID.'
      });
    }

    if (doc.password !== password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect password.'
      });
    }

    const deleted = await doc.deleteOne();

    if (!deleted) {
      return res.status(500).json({
        status: 'error',
        message: 'Account deletion failed.'
      });
    } else {
      return res.status(204).end(); // 204 should have empty body
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed.',
      error: error.message
    });
  }
};