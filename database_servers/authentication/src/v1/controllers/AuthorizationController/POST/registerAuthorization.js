const AuthModel = require('../../../models/auth.model');

exports.registerAuthorization = async (req, res) => {
  for (let requiredParameter of ['email', 'password']) {
    if (!req.body[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  };
  
  try {
    const newAuth = new AuthModel({
      email: req.body.email,
      password: req.body.password,
      depends_on_profile: req.body.id
    });

    await newAuth.save();

    res.status(201).json({
      status: 'success',
      data: { id: newAuth._id }
    });
  } catch (error) {
    console.error('Error creating new authorization:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the authorization.'
    });
  }
};