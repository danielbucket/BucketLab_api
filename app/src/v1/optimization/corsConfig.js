const { NODE_ENV } = process.env;

const whitelist = ['https://bucketlab.io'];

exports.corsConfig = () => {
  return {
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours in seconds
    exposedHeaders: ['Content-Length', 'X-Response-Time'],
    origin: (origin, callback) => {
      if (NODE_ENV === 'development') {
        console.log(`CORS request from origin: ${origin}`);
        return callback(null, true); // Allow all origins in development
      }

      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Dude, you can't be here. You're not on the whitelist, bruh.`));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  };
};