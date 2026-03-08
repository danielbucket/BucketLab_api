exports.corsConfig = () => {
  return {
    origin: 'http://app_server:4021',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
  };
};