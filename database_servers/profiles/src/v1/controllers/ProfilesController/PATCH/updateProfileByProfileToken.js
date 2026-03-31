const jwt = require('jsonwebtoken');
const Profile = require('../../../models/profile.model');

exports.updateProfileByProfileToken = async (req, res) => {
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
    const doc = await Profile.findOne({ email });
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No profile found for authenticated user.'
      });
    }

    const { body } = req;

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
        message: 'Profile update failed.',
        error: error
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Profile update failed.',
        error: 'Duplicate email address'
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Profile update failed.',
      error: error.message
    });
  }
};