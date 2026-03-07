const jwt = require('jsonwebtoken');

// JWT authorization middleware for protected routes
exports.authMiddleware = () => (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Unauthorized: No token provided');
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized. Invalid token.'
    });
  }
};