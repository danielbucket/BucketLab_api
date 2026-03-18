const AuthModel = require('../../../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.loginAuthorization = async (req, res) => {
  for (let requiredParameter of ['email', 'password']) {
    if (!req.body[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  };
  
  try {
    const doc = await AuthModel.findOne({ email: req.body.email }).lean();
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        fail_type: 'email_not_found',
        message: 'No authorization found for that email.'
      });
    };

    const profileData = await doc.json();

    const passwordMatch = await bcrypt.compare(req.body.password, profileData.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'fail',
        fail_type: 'invalid_password',
        message: 'Invalid password.'
      });
    };

    doc.logged_in = true;
    doc.logged_in_at = new Date().toISOString();

    await doc.save();

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      {
        id: doc._id,
        email: doc.email,
        permissions: doc.permissions
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      profileData: {
        first_name: doc.first_name,
        last_name: doc.last_name,
        id: doc._id,
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