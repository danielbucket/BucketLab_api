const AuthModel = require('../../../models/auth.model');
const jwt = require('jsonwebtoken');

exports.logout = async (req, res) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authorization token required for logout.'
      });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Verify and decode token to get user email
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid or expired token.'
      });
    }

    const { email } = decoded;
    if (!email) {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid token structure.'
      });
    }

    // Find and update the auth document
    const doc = await AuthModel.findOne({ email });
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No authentication found for this user.'
      });
    }

    // Invalidate the token and update logout info
    doc.JWT_token = null;
    doc.logged_in = false;
    doc.last_logout_at = new Date().toISOString();
    doc.updated_at = new Date().toISOString();

    await doc.save();

    return res.status(200).json({
      status: 'success',
      message: 'Logout successful.'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during logout.',
      error: error.message
    });
  }
};