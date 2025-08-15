const { NODE_ENV } = process.env;

const whitelist = [
  'https://bucketlab.io', // Production frontend
  'http://localhost:5173', // Development frontend

  'http://app_server:4020', // App Server
  'http://auth_server:4021', // Auth Server
  'http://laboratory_server:4420', // Laboratory Server

  'http://localhost:4020', // App Server in local development
  'http://localhost:4021', // Auth Server in local development
  'http://localhost:4420', // Laboratory Server in local development
];

exports.corsConfig = () => {
  return {
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours in seconds
    exposedHeaders: ['Content-Length', 'X-Response-Time'],
    origin: (origin, callback) => {
      if (NODE_ENV === 'development') {
        return callback(null, true); // Allow all origins in development
      }

      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Though shall not pass! Because: ${origin} is not allowed`));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  };
};