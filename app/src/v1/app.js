const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const app = express();
const { NODE_ENV } = process.env;

const { laboratoryProxy } = require('./proxies/laboratoryProxy.js');
const { accountsProxy } = require('./proxies/accountsProxy.js');
const { rateLimiter } = require('./optimization/rateLimiter.js');
const { corsConfig } = require('./optimization/corsConfig.js');

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('Running in development mode');
  console.log('Morgan logging enabled');
};

// This is a workaround for Cloudflare's proxy IP address and rate limiting
// https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
app.set('trust proxy', 1);

app.options('/*', cors(corsConfig())); // Pre-flight request for all routes

app.use(cors(corsConfig()));
app.use(rateLimiter());
app.use('/*', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  next()
});

app.get('/', (req, res) => {
  console.log('Request received at:', req.requestTime);
  res.status(200).json({
    message: 'This is the BucketLab.io API Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      accounts: '/accounts',
      laboratory: '/laboratory'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Request received at App_Server: ${req.requestTime}`);
  next();
});

app.use('/laboratory', laboratoryProxy());
app.use('/accnt', accountsProxy());

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

module.exports = app;