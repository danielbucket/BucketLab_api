const Profile = require('../../../models/profile.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.loginProfile = async (req, res) => {
  for (let requiredParameter of ['email', 'password']) {
    if (!req.body[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  }

  try {
    const profile = await Profile.findOne({ email: req.body.email });
    if (!profile) {
      return res.status(404).json({
        status: 'fail',
        fail_type: 'not_found',
        message: 'No profile found with that email.'
      });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, profile.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'fail',
        fail_type: 'invalid_password',
        message: 'Invalid password.'
      });
    }

    profile.logged_in = true;
    profile.logged_in_at = new Date().toISOString();

    await profile.save();

    const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';
    const token = jwt.sign(
      {
        id: profile._id,
        email: profile.email,
        permissions: profile.permissions,
        avatar: profile.avatar
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      profileData: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        id: profile._id,
        token: token,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed.',
      error: error.message
    });
  }
};