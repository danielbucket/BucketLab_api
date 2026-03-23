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
        message: 'An authentication document with that email already exists.'
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
    });

    await newAuth.save();

    try {
      // Send a request to the profiles server to create a new profile for this authentication document
      const profileData = {
        depends_on_auth: newAuth._id,
        email: newAuth.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      };

      const profileResponse = await fetch('http://profiles_server:4021/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
    } catch (error) {
      console.error('Error creating profile for new authentication:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Authentication created, but an error occurred while creating the associated profile.'
      });
    };
    
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