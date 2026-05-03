const Administration = require('../../../models/admin.model');

/**
 * POST Controller: Initialize the Administration singleton.
 * Only profiles with 'empire' permission can initiate.
 * Requires ADMIN_INIT_PASSWORD from environment variables.
 * Once created, no other singletons can be created.
 * 
 * Calls Administration.initializeSingleton() model method to create the singleton.
 */
exports.initializeSingleton = async (req, res) => {
  const { user } = req;
  const { initiator_password } = req.body;

  // Validate required fields
  if (!user || !user.id) {
    return res.status(401).json({
      status: 'error',
      message: 'Authenticated user is required to initialize Administration singleton.'
    });
  }

  if (!initiator_password) {
    return res.status(422).json({
      status: 'error',
      message: 'Missing required parameter: initiator_password.'
    });
  }

  try {
    // For now, we assume the user has been validated by middleware
    // In production, you would:
    // 1. Fetch the user's profile from the profiles service
    // 2. Verify the user has 'empire' permission
    // 3. Then proceed with initialization

    // Call the model's initializeSingleton method
    const admin = await Administration.initializeSingleton(
      user.id,
      initiator_password
    );

    return res.status(201).json({
      status: 'success',
      message: 'Administration singleton initialized successfully.',
      data: {
        id: admin._id,
        initiated_by_profile: admin.initiated_by_profile,
        email: admin.email,
        created_at: admin.created_at
      }
    });
  } catch (error) {
    console.error('Error initializing Administration singleton:', error);

    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message || 'An error occurred while initializing the Administration singleton.',
      error: error.message
    });
  }
};
