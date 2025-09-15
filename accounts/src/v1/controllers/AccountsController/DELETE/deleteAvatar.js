const Account = require('../../../models/account.model');
const Avatar = require('../../../models/avatar.model');

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
    const account = await Account.findById(id);
    if (!account || !account.avatar_id) {
      return res.status(404).json({
        status: 'fail',
        message: 'No avatar found for this account.'
      });
    }
    
    // Delete the avatar document
    await Avatar.findByIdAndDelete(account.avatar_id);
    
    // Remove reference from account
    account.avatar_id = null;
    await account.save();
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
