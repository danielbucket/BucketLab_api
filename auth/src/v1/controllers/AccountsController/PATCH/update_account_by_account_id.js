const Account = require('../../../models/account.model');

exports.updateAccountByAccountId = async (req, res) => {
  const id = req.params.id;
  const { body } = req;
  
  try {
    const doc = await Account.findById(id);

    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No account found with that ID.'
      });
    }

    // Check for empty/null values before updating
    for (const key of Object.keys(body)) {
      if (body[key] === '' || body[key] === null || body[key] === undefined) {
        return res.status(404).json({
          status: 'fail',
          message: `The key: '${key}' cannot be updated.`
        });
      }
      doc[key] = body[key];
    }

    doc.updated_at = Date.now();
    
    const saved = await doc.save();
    
    return res.status(200).json({
      status: 'success',
      data: { saved }
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(500).json({
        status: 'error',
        message: 'Account update failed.',
        error: error.message
      });
    }
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      return res.status(500).json({
        status: 'error',
        message: 'Account update failed.',
        error: 'Duplicate email address'
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Account update failed.',
      error: error.message
    });
  }
};