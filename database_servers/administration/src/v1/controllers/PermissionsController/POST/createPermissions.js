const PermissionsModel = require('../../../models/permissions.schema');

exports.createPermissions = async (req, res) => {
  const originHeader = req.headers['origin'] || 'unknown origin';
  
  // Validate required parameters
  for (let requiredParameter of ['depends_on_auth', 'permissions']) {
    if (!req.body[requiredParameter]) {
      return res.status(422).json({
        status: 'error',
        message: `Missing required parameter: ${requiredParameter}.`
      });
    };
  };

  try {
    // Check if a permissions document already exists for this auth ID
    const existingPermissions = await PermissionsModel.findOne({ depends_on_auth: req.body.depends_on_auth }).lean();
    if (existingPermissions) {
      return res.status(409).json({
        status: 'fail',
        fail_type: 'permissions_already_exists',
        message: 'A permissions document for that auth ID already exists.'
      });
    };

    const newPermissions = new PermissionsModel({
      depends_on_auth: req.body.depends_on_auth,
      permissions: req.body.permissions
    });

    await newPermissions.save();
    
    res.status(201).json({
      status: 'success',
      data: { id: newPermissions._id }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Permissions creation failed.',
      error: error.message
    });
  };
};