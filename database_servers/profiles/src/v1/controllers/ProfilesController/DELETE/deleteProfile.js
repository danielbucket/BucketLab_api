const Profile = require('../../../models/profile.model');

exports.deleteProfile = async (req, res) => {
  try {
    // Verify that the request has come from the authentication server
    // by checking for a custom header set by the authentication proxy
    const authServerHeader = req.headers['x-auth-server'];
    if (!authServerHeader || authServerHeader !== 'true') {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden. This endpoint can only be accessed by the Authentication Server.'
      });
    }
    
    const authId = req.params.id;
    // The id from auth server is the authentication record's ID, stored in depends_on_auth field
    const deletedProfile = await Profile.findOneAndDelete({ depends_on_auth: authId });
    if (!deletedProfile) {
      return res.status(404).json({
        status: 'fail',
        message: `No profile found with authentication ID ${authId}.`
      });
    }

    return res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete profile.',
      error: err.message
    });
  }
};