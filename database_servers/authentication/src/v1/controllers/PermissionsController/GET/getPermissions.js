const { ADMINISTRATION_SERVER_URL } = process.env;

exports.getPermissions = async (req, res) => {
  const { user } = req;

  if (!user || !user.permissions) {
    return res.status(401).json({
      status: 'fail',
      fail_type: 'unauthorized',
      message: 'User is not authenticated or permissions are not available.'
    });
  }

  try {
    const response = fetch(`${ADMINISTRATION_SERVER_URL}/permissions/get-permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Origin': 'authentication_server' // Custom header to indicate the request is from the authentication server
      },
      // Include the user's permissions in the request body to the administration server
      body: JSON.stringify({ permissions: user.permissions })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch permissions');
    }

    return res.status(200).json({
      status: 'success',
      data: {
        permissions: data.permissions
      }
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return res.status(500).json({
      status: 'fail',
      fail_type: 'server_error',
      message: 'An error occurred while fetching permissions.'
    });
  }
};