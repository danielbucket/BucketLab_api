const { permissionsList } = require('../utils/permissionsList.js');

exports.permissionsMiddleware = (req, res, next) => {
  const requestedPermission = req.body.permission;
  
  if (!requestedPermission || !permissionsList.includes(requestedPermission)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid permission requested.'
    });
  }

  next();
};