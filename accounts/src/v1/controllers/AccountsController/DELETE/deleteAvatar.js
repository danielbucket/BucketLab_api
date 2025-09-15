const Account = require('../../../models/account.model');

// DELETE /avatar/:id
exports.deleteAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid account ID format.'
      });
    }
    const doc = await Account.findById(id);
    if (!doc || !doc.avatar_data) {
      return res.status(404).json({
        status: 'fail',
        message: 'No avatar found for this account.'
      });
    }
    doc.avatar_data = null;
    doc.avatar_content_type = null;
    await doc.save();
    return res.status(200).json({
      status: 'success',
      message: 'Avatar deleted successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete avatar.',
      error: error.message
    });
  }
};
