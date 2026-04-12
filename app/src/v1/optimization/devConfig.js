const morgan = require('morgan');

exports.devConfig = (app) => {
  app.use(morgan('dev'));
  console.log('Running in development mode');
  console.log('Morgan logging enabled');
}