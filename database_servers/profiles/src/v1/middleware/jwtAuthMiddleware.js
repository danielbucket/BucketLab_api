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
  
  // Verify and decode the token
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(403).json({
      status: 'fail',
      message: 'Invalid or expired token.'
    });
  }

  // Extract email and id from decoded token
  const { email, id } = decoded;
  if (!email || !id) {
    return res.status(403).json({
      status: 'fail',
      message: 'Invalid token structure. Email or ID missing.'
    });
  }

  next();
};
