const Profile = require('../../../models/profile.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.createProfile = async (req, res) => {
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

    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';
    const token = jwt.sign({
        id: createdProfile._id,
        email: createdProfile.email
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // contact the authentication server to create a corresponding auth record
    const authResponse = await fetch('http://bucketlab_internal:4024/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: createdProfile.email,
        id: createdProfile._id,
        password: body.password
      })
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      return res.status(authResponse.status).json({
        status: 'fail',
        fail_type: errorData.fail_type || 'authentication_registration_failed',
        message: errorData.message || 'Failed to create authentication record for new profile.'
      });
    };

    // update the profile with the token returned from the authentication server (if any)
    const authData = await authResponse.json();
    if (!authData._id) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve authentication record ID after profile creation.'
      });
    };

    // Link the created profile with the corresponding auth record by saving the auth record ID in the profile's depends_on_auth field
    createdProfile.depends_on_auth = authData.id;ˇ
    await createdProfile.save();
    
    return res.status(201).json({
      status: 'success',
      message: 'Profile created successfully.',
      profileData: {
        first_name: createdProfile.first_name,
        last_name: createdProfile.last_name,
        email: createdProfile.email,
        id: createdProfile._id,
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