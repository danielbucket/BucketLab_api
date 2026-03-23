const bcrypt = require('bcrypt');
const AuthModel = require('../../../models/auth.model');

exports.createAuthentication = async (req, res) => {
  // Validate required parameters
  for (let requiredParameter of ['email', 'password']) {
    if (!req.body[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    };
  };
  
  try {
    // Check if an authentication with the same email already exists
    const existingAuth = await AuthModel.findOne({ email: req.body.email }).lean();
    if (existingAuth) {
      return res.status(409).json({
        status: 'fail',
        fail_type: 'email_already_exists',
        message: 'An authentication with that email already exists.'
      });
    };

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;

    // Create a new authentication document
    const newAuth = new AuthModel({
      email: req.body.email,
      password: req.body.password,
      depends_on_profile: req.body.id
    });

    // Save the new authentication document to the database
    await newAuth.save();

    // Return a success response with the new authentication's ID
    res.status(201).json({
      status: 'success',
      data: { id: newAuth._id }
    });
  } catch (error) {
    console.error('Error creating new authentication:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the authentication.'
    });
  };
};