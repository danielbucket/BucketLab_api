exports.get_profile_by_id = async (req, res) => {
  try {
    // Simulate fetching user profile from a database or service
    const profile = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com'
    };

    res.status(200).json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile'
    });
  }
};