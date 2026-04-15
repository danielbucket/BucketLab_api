const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const app = express();
const { NODE_ENV } = process.env;

const { authenticationProxy } = require('./proxies/authenticationProxy.js');
const { laboratoryProxy } = require('./proxies/laboratoryProxy.js');
const { messagesProxy } = require('./proxies/messagesProxy.js');
const { helloWorldProxy } = require('./proxies/helloWorldProxy.js');
const { profilesProxy } = require('./proxies/profilesProxy.js');
const { rateLimiter } = require('./optimization/rateLimiter.js');
const { corsConfig } = require('./optimization/corsConfig.js');
const helloWorldMiddleware = require('./middleware/helloWorldMiddlewear.js');
const healthCheckRouter = require('./serviceEndpoints/health-check.js');

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

app.use('/health', healthCheckRouter);
app.use('/hello-world', helloWorldMiddleware, helloWorldProxy());
app.use('/auth', authenticationProxy());
app.use('/profiles', profilesProxy());
app.use('/laboratory', laboratoryProxy());

app.all('*', (req,res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

module.exports = app;