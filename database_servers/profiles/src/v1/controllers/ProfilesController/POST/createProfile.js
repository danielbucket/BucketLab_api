const Profile = require('../../../models/profile.model');

exports.createProfile = async (req, res) => {
  const { body } = req;
  
  for (let requiredParameter of ['first_name', 'last_name', 'email', 'depends_on_auth']) {
    if (!req.body?.[requiredParameter]) {
      return res.status(422).send({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    }
  }

  try {
    const found = await Profile.exists({ email: body.email });
    if (found) {
      return res.status(409).json({
        status: 'fail',
        message: 'Profile with that email already exists.'
      });
    }

    // Password hashing is handled by the Profile model's pre-save hook
    const newProfileData = Object.assign({}, {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      depends_on_auth: body.depends_on_auth
    });
    const createdProfile = await Profile.create(body);

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