const Profile = require('../../../models/profile.model'); // Adjust the path as necessary

exports.getProfileByToken = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  const { user } = req;
  const profileData = await Profile.findById(user.id);

  const returnedProfileData = Object.assign({}, {
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    email: profileData.email,
    website: ProfileData.website,
    company: ProfileData.company,
    phone: ProfileData.phone,
    messages: ProfileData.messages,
    created_at: ProfileData.created_at
  });

  if (!ProfileData) return res.sendStatus(404);
  return res.status(200).json({
    status: 'success',
    profileData: returnedProfileData
  });
};
