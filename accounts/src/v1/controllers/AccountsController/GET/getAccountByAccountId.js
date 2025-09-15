const Account = require('../../../models/account.model');

exports.getAccountByAccountId = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally validate ObjectId format if using MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid account ID format.'
      });
    }

    // Find the account by ID
    const doc = await Account.findById(id).lean();
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No account found with that ID.'
      });
    };
    
    // Only return non-sensitive fields
    const {
      profile_avatar,
      first_name,
      last_name,
      email,
      website,
      company,
      phone,
      messages,
      created_at
    } = doc;

    return res.status(200).json({
      status: 'success',
      data: {
        profile_avatar,
        first_name,
        last_name,
        email,
        website,
        company,
        phone,
        messages,
        created_at
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error retrieving account.',
      error: err.message
    });
  };
};