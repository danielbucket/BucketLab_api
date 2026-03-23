const AuthModel = require('../../../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.loginAuthorization = async (req, res) => {
  console.log('LOGIN REQUEST BODY:', req.body);
  // Validate required parameters
  for (let requiredParameter of ['email', 'password']) {
    if (!req.body[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  };
  
  try {
    // Find the authorization document by email
    const doc = await AuthModel.findOne({ email: req.body.email }).lean();
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        fail_type: 'email_not_found',
        message: 'No authorization found for that email.'
      });
    };

    // Compare the provided password with the hashed password in the database
    const profileData = await doc.json();

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(req.body.password, profileData.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'fail',
        fail_type: 'invalid_password',
        message: 'Invalid password.'
      });
    };

    // Update the logged_in status and logged_in_at timestamp
    doc.logged_in = true;
    doc.logged_in_at = new Date().toISOString();

    // Save the updated document to the database
    await doc.save();

    // Generate a JWT token for the logged-in user
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

    // Return a success response with the profile data and token
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