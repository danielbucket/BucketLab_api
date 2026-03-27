const Profile = require('../../../models/profile.model');

exports.getProfileByProfileId = async (req, res) => {
  try {
    // Get user info from JWT headers set by jwtAuthMiddleware
    const userEmail = req.headers['x-user-email'];
    const userId = req.headers['x-user-id'];

    if (!userEmail || !userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'User authentication required. Email or ID missing from token.'
      });
    }

    console.log(`Fetching profile for authenticated user: ${userEmail}`);

    // Find the profile by email (which is unique and matches the authenticated user)
    const doc = await Profile.findOne({ email: userEmail }).lean();
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No profile found for authenticated user.'
      });
    };
    
    // Only return non-sensitive fields
    const profileData = Object.assign({}, {
      id: _id,
      avatar: doc.profile_avatar,
      first_name: doc.first_name,
      last_name: doc.last_name,
      email: doc.email,
      website: doc.website,
      company: doc.company,
      phone: doc.phone,
      messages: doc.messages,
      created_at: doc.created_at
    });

    return res.status(200).json({
      status: 'success',
      data: profileData
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error retrieving profile.',
      error: err.message
    });
  };
};