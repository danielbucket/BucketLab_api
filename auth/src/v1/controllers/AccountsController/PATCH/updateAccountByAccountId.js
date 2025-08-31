const Account = require('../../../models/account.model');

exports.updateAccountByAccountId = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid account ID format.'
      });
    }

    const doc = await Account.findById(id);
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No account found with that ID.'
      });
    }

    // Only allow updates to permitted fields
    const allowedFields = [
      'first_name', 'last_name', 'email', 'website', 'phone', 'company'
    ];

    for (const key of Object.keys(body)) {
      if (!allowedFields.includes(key)) {
        console.log('Attempting to update disallowed field:', key);
        return res.status(400).json({
          status: 'fail',
          message: `The key: '${key}' cannot be updated.`
        });
      }
      
      if (body[key] === '' || body[key] === null || body[key] === undefined) {
        console.log('Invalid value for key:', key, 'value:', body[key]);
        return res.status(400).json({
          status: 'fail',
          message: `The key: '${key}' cannot be empty or null.`
        });
      }
      doc[key] = body[key];
    }

    doc.updated_at = Date.now();
    const saved = await doc.save();

    // Return only non-sensitive updated fields
    const {
      first_name, last_name, email, website, company, phone, messages, updated_at
    } = saved;

    return res.status(200).json({
      status: 'success',
      data: {
        first_name, last_name, email, website, company, phone, messages, updated_at
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Account update failed.',
        error: error.message
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
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