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
        return res.status(400).json({
          status: 'fail',
          message: `The key: '${key}' cannot be updated.`
        });
      }

      // Special handling for website: set to undefined if empty or null to avoid isURL validation
      if (key === 'website' && (body[key] === '' || body[key] === null)) {
        doc[key] = undefined;
      } else {
        doc[key] = body[key];
      }
    }

    doc.updated_at = Date.now();
    const saved = await doc.save();

    const updatedFields = Object.keys(body).filter(key => allowedFields.includes(key));

    return res.status(200).json({
      status: 'success',
      data: {
        updatedFields
      }
    });
  } catch (error) {

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Account update failed.',
        error: error
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