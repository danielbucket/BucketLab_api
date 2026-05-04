const AuthModel = require('../../../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.loginAuthorization = async (req, res) => {
  const { body } = req;
  // Validate required parameters
  for (let requiredParameter of ['email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  };
  
  try {
    const doc = await AuthModel.findOne({ email: body.email });
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        fail_type: 'email_not_found'
      });
    };

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(body.password, doc.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'fail',
        fail_type: 'invalid_password'
      })
    };

    // Update the logged_in status and logged_in_at timestamp
    doc.logged_in = true;
    doc.logged_in_at = new Date().toISOString();

    // Save the updated document to the database first
    await doc.save();

    // Generate a JWT token for the logged-in user (after successful save)
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables')
    }

    const token = jwt.sign({
        id: doc._id,
        email: doc.email,
        permissions: doc.permissions
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
    );
    
    // Return a success response with the token
    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      token: token
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Login failed. An error occurred during authentication.',
      error: error.message
    });
  }
};