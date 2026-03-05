const Profile = require('../../../models/profile.model');
const Avatar = require('../../../models/avatar.model');

// DELETE /avatar/:id
exports.deleteAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid profile ID format.'
      });
    };

    const profile = await Profile.findById(id);
    if (!profile || !profile.avatar_id) {
      return res.status(404).json({
        status: 'fail',
        message: 'No avatar found for this profile.'
      });
    };
    
    // Delete the avatar document
    await Avatar.findByIdAndDelete(profile.avatar_id);
    
    // Remove reference from profile
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
  };
};
