const morgan = require('morgan');
const express = require('express');
const app = express();
const { NODE_ENV } = process.env;

const { laboratoryProxy } = require('../optimization/laboratoryProxy.js');
const { rateLimiter } = require('../optimization/rateLimiter.js');
const { corsConfig } = require('../optimization/corsConfig.js');
const authRoutes = require('./routes/authRoutes.js');
const travelers = require('./routes/travelerRoutes.js');
const messages = require('./routes/messageRoutes.js');

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('Running in development mode');
  console.log('Morgan logging enabled');
};

// This is a workaround for Cloudflare's proxy IP address and rate limiting
// https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
app.set('trust proxy', 1);

app.options('*', corsConfig()); // Pre-flight request for all routes

app.use(corsConfig());
app.use(express.json());
app.use(rateLimiter());
app.use('/*', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  console.log('Request received at:', req.requestTime);
  res.status(200).json({
    status: 'success',
    message: 'BucketLab API Root'
  });
});

app.use('/laboratory', laboratoryProxy());

app.use(authRoutes);
app.use('/travelers', travelers);
app.use('/messages', messages);
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    fail_type: 'server_error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;