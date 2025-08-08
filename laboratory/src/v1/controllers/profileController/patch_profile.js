exports.patch_profile = async (req, res) => {
  try {
    // Simulate updating user profile in a database or service
    const updatedProfile = {
      id: 1,
      name: req.body.name || 'John Doe',
      email: req.body.email || 'john.doe@example.com'
    };

    res.status(200).json({
      status: 'success',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
};
