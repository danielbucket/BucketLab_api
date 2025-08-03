const cors = require('cors');
const { NODE_ENV, CORS_WHITELIST } = require('dotenv/config');

const whitelist = CORS_WHITELIST ? CORS_WHITELIST.split(',') : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (NODE_ENV === 'development' || whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, origin);
    } else {
      callback(new Error(`Though shall not pass! Because: ${origin} is not allowed`));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  optionsSuccessStatus: 200
};

exports.CORS = corsConfig => {
  return cors({ ...corsOptions, ...corsConfig });
};