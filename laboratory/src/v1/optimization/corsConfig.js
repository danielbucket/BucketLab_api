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
    origin: '*',
    // Use the whitelist to restrict origins
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
  };
};