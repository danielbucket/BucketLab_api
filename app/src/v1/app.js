const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const app = express();
const { NODE_ENV } = process.env;

const { laboratoryProxy } = require('../proxies/laboratoryProxy.js');
const { authProxy } = require('../proxies/authProxy.js');
const { rateLimiter } = require('../optimization/rateLimiter.js');
const { corsConfig } = require('../optimization/corsConfig.js');

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('Running in development mode');
  console.log('Morgan logging enabled');
};

// This is a workaround for Cloudflare's proxy IP address and rate limiting
// https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
app.set('trust proxy', 1);

// app.options('*', corsConfig()); // Pre-flight request for all routes

app.use(cors(corsConfig()));
app.use(express.json());
app.use(rateLimiter());
app.use('/*', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  next()
});

app.get('/', (req, res) => {
  console.log('Request received at:', req.requestTime);
  res.status(200).json({
    status: 'success',
    message: 'BucketLab API Root'
  });
});

app.use('/', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Request received at App_Server: ${req.requestTime}`);
  next();
});

app.use('/laboratory', laboratoryProxy());
app.use('/auth', authProxy());

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    fail_type: 'server_error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;