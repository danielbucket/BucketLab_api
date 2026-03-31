const jwt = require('jsonwebtoken');
const Profile = require('../../../models/profile.model');

exports.getProfileByToken = async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authorization token required. Use Bearer token in Authorization header.'
      });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid or expired token.'
      });
    }

    // Extract email and id from decoded token
    const { email, id } = decoded;
    if (!email || !id) {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid token structure. Email or ID missing.'
      });
    }

    // Find profile by email (which matches the authenticated user)
    const profileData = await Profile.findOne({ email }).lean();
    if (!profileData) {
      return res.status(404).json({
        status: 'fail',
        message: 'No profile found for authenticated user.'
      });
    }

    // Return profile data
    const profileResponse = {
      id: profileData._id,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      email: profileData.email,
      website: profileData.website,
      company: profileData.company,
      phone: profileData.phone,
      messages: profileData.messages,
      created_at: profileData.created_at
    };

    return res.status(200).json({
      status: 'success',
      profile: profileResponse
    });
  } catch (error) {
    console.error('Error fetching profile by token:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching profile.',
      error: error.message
    });
  }
};
