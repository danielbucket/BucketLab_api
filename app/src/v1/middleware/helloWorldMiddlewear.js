const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = helloWorldMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Only Travelers with special access, approved by Empire Himself no less, may journey beyond this gateway.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const { permissions, id } = decoded;

    if (!permissions || !permissions.includes('traveler')) {
      return res.status(403).json({
        status: 'fail',
        message: `It seems that you're a ${permissions ? permissions.join(', ') : 'user'} and not a traveler. Only travelers with special access may journey beyond this gateway.`
      });
    }

    req.passport = {
      id,
      email: decoded.email,
      permission_type: 'traveler',
      gateway_access: 'granted',
      access_level: 'limited'
    };
    req.requestTime = new Date().toISOString();
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized. Invalid token.'
    });
  }
};

