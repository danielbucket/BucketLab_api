const rateLimit = require('express-rate-limit');
const { NODE_ENV } = process.env;

// In development mode, we can disable rate limiting for easier testing
if (NODE_ENV === 'development') {
  console.log('Rate limiting is disabled in development mode');
  exports.rateLimiter = (req, res, next) => next();
} else {
  console.log('Rate limiting is enabled.');
}

exports.rateLimiter = () => rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable the 'x-RateLimit-*' headers
});