const Profile = require('../../../models/profile.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.newProfile = async (req, res) => {
  const { body } = req;
  
  for (let requiredParameter of ['first_name', 'last_name', 'email', 'password']) {
    if (!body[requiredParameter]) {
      return res.status(422).send({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  };
  
  try {
    const found = await Profile.exists({ email: body.email });
    if (found) {
      return res.status(409).json({
        status: 'fail',
        message: 'Profile with that email already exists.'
      });
    };

    // Password hashing is handled by the Profile model's pre-save hook
    const createdProfile = await Profile.create(body);

    const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';
    const token = jwt.sign({
        id: createdProfile._id,
        email: createdProfile.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      status: 'success',
      message: 'Profile created successfully.',
      profileData: {
        first_name: createdProfile.first_name,
        last_name: createdProfile.last_name,
        email: createdProfile.email,
        id: createdProfile._id,
        token: token
      }
    })
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Profile creation failed.',
      error: err.message
    })
  };
};