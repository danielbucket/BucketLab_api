const Profile = require('../../../models/profile.model');
const bcrypt = require('bcrypt');

exports.deleteProfileByProfileId = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid profile ID format.'
      })
    };

    // Find profile by ID
    const doc = await Profile.findById(id);
    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No profile found with that ID.'
      })
    };
    
    // Use bcrypt to compare hashed password
    const passwordMatch = await bcrypt.compare(password, doc.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect password.'
      })
    };

    // Delete the profile
    await doc.deleteOne();

    return res.status(204).end(); // 204 should have empty body
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Database operation failed.',
      error: error.message
    })
  };
};