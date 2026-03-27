const { NODE_ENV } = process.env;

const whitelist = ['https://bucketlab.io', 'http://localhost:5173'];

exports.corsConfig = () => {
  return {
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours in seconds
    exposedHeaders: ['Content-Length', 'X-Response-Time'],
    origin: (origin, callback) => {
      console.log(`CORS check for origin: ${origin} at ${new Date().toISOString()}`);
      if (NODE_ENV === 'development') {
        return callback(null, true); // Allow all origins in development
      }

      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`You shall not pass, maf'k! Because: ${origin} is not allowed`));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  };
};