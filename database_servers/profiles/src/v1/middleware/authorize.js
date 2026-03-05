import jwt from 'jsonwebtoken';

// Optional logger function
const logAuth = (message, req) => {
  if (process.env.AUTH_LOGGING === 'true') {
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`[AUTH] ${message} | IP: ${ip} | URL: ${req.originalUrl}`);
  }
};

// JWT authorization middleware for protected routes (async/await)
export const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logAuth('Unauthorized: No token provided', req);
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';

    // jwt.verify does not support promises natively, so wrap in a promise
    const verifyToken = (token, secret) => new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const decoded = await verifyToken(token, JWT_SECRET);
    req.user = decoded;
    logAuth('Authorized', req);
    next();
  } catch (err) {
    logAuth(`Forbidden: Invalid token (${err.message})`, req);
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden. Invalid token.'
    });
  }
};