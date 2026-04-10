const jwt = require('jsonwebtoken');
const Profile = require('../../../models/profile.model');

exports.updateProfileByProfileToken = async (req, res) => {
  const { email, id } = req.user;

  try {
    if (!email || !id) {
      return res.status(401).json({
        status: 'fail',
        message: 'User authentication required. Email or ID missing from token.'
      });
    }

    // Find profile by email (which matches the authenticated user)
    const doc = await Profile.findOne({ depends_on_auth: id });
    if (!doc || doc.email !== email) {
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

    return res.status(200).json({
      status: 'success',
      profile: { ...saved }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Profile update failed.',
      error: error.message
    });
  }
};