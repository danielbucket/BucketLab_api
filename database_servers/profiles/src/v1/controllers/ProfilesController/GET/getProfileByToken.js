const jwt = require('jsonwebtoken');
const Profile = require('../../../models/profile.model');

exports.getProfileByToken = async (req, res) => {
  const { email, id } = req.user;
  try {
    if (!email || !id) {
      return res.status(401).json({
        status: 'fail',
        message: 'User authentication required. Email or ID missing from token.'
      });
    }

    // Find profile by depends_on_auth (which matches the authenticated user's ID)
    const doc = await Profile.findOne({ depends_on_auth: id }).lean();
    if (!doc || doc.email !== email) {
      return res.status(404).json({
        status: 'fail',
        message: 'No profile found for authenticated user.'
      });
    }

    // Return profile data
    const profileResponse = {
      id: doc._id,
      first_name: doc.first_name,
      last_name: doc.last_name,
      email: doc.email,
      website: doc.website,
      company: doc.company,
      phone: doc.phone,
      messages: doc.messages,
      created_at: doc.created_at
    };

    return res.status(200).json({
      status: 'success',
      profile: profileResponse
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching profile.',
      error: error.message
    });
  }
};
