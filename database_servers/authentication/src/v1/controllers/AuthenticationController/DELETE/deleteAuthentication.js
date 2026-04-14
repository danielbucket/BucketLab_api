const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Authentication = require('../../../models/auth.model.js');

exports.deleteAuthentication = async (req, res) => {
  try {
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
        message: 'Invalid token payload.'
      });
    }

    // Find authentication record by email (which matches the authenticated user)
    const doc = await Authentication.findOne({ _id: id, email });
    console.log('Authentication record found for deletion:', doc);
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No authentication record found for authenticated user.'
      });
    }

    // Use bcrypt to compare hashed password
    const { password } = req.body;
    const passwordMatch = await bcrypt.compare(password, doc.password);
    console.log('Password match result:', passwordMatch);
    if (!passwordMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(403).json({
        status: 'fail',
        message: 'Incorrect password.'
      });
    }

    let profileResponse;
    try {
      profileResponse = await fetch(`http://profiles_server:4021/delete/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'X-Auth-Server': 'true' // Custom header to verify request is from authentication server
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Authentication record verified, but an error occurred while deleting the associated profile.',
        error: error.message
      });
    }

    // Delete the authentication record
    await Authentication.deleteOne({ email });

    res.status(200).json({
      status: 'success',
      message: 'Authentication record deleted successfully.'
    });
  } catch (err) {
    console.error('Error in deleteAuthentication:', err);
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error while deleting authentication record.'
    });
  }
};