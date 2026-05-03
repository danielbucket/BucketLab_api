const Administration = require('../../../models/admin.model.js');

exports.requestPermissions = async (req, res) => {
  const { user } = req;
  const { permission } = req.body;

  // Validate required fields
  if (!permission || !user || !user.id) {
    return res.status(422).json({
      status: 'error',
      message: 'Missing required parameters: permission and authenticated user ID.'
    });
  }

  try {
    // Get the singleton administration instance
    const admin = await Administration.getSingleton();

    // If singleton doesn't exist, it hasn't been initialized yet
    if (!admin) {
      return res.status(503).json({
        status: 'error',
        message: 'Administration singleton has not been initialized yet. Permission requests cannot be processed at this time.'
      });
    }

    // Check if this user has already requested this permission
    const existingRequest = admin.requested_permissions.find(
      p => p.name === permission && p.requested_by.toString() === user.id
    );

    if (existingRequest && existingRequest.request_status === 'pending') {
      return res.status(409).json({
        status: 'fail',
        fail_type: 'duplicate_request',
        message: `You have already requested the '${permission}' permission and it is pending approval.`
      });
    }

    // Add the new permission request
    admin.requested_permissions.push({
      name: permission,
      requested_by: user.id,
      request_status: 'pending'
    });

    admin.updated_at = new Date().toISOString();
    await admin.save();

    return res.status(201).json({
      status: 'success',
      message: `Permission '${permission}' requested successfully. Awaiting administrator approval.`,
      data: {
        permission: permission,
        request_status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error requesting permission:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while requesting permission.',
      error: error.message
    });
  }
};