const { permissionsList } = require('../utils/permissionsList.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.permissionsMiddleware = (req, res, next) => {
  // Authenticate user first
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded token to request for downstream use

  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized. Invalid token.'
    });
  }

  // Check if user has the required permissions
  try {
    const userPermissions = req.user.permissions || [];
    if (userPermissions.includes(requestedPermission)) {
      return {
        status: 'success',
        message: 'Permission already granted.',
      };
    }
  } catch {
    return res.status(403).json({
      status: 'fail',
      message: 'Invalid permission requested.'
    });
  }

  next();
};
