const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens in Authorization header and extracts email
 */
exports.jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Access token required'
    });
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid or expired token'
      });
    }
    
    // Validate token has required fields
    if (!user.email || !user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid token structure'
      });
    }
    
    // Forward email in custom header for downstream services
    req.headers['x-user-email'] = user.email;
    req.headers['x-user-id'] = user.id;
    
    next();
  });
};
