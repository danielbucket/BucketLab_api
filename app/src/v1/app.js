const morgan = require('morgan');
const express = require('express');
const app = express();
const optimization = require('../optimization/index.js');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes.js');
const accounts = require('./routes/accountRoutes.js');
const messages = require('./routes/messageRoutes.js');

const { NODE_ENV } = process.env;

const corsOptions = {
  origin: ['https://bucketlab.io', 'http://localhost:5173', 'http://localhost:41373'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  optionsSuccessStatus: 200
};

if (NODE_ENV === 'development') {
  corsOptions.origin = 'http://localhost:4020';
  app.use(morgan('dev'));
  console.log('Development mode: Morgan logging enabled');
  console.log(`Development mode: CORS enabled for ${corsOptions.origin}`);
};

// This is a workaround for Cloudflare's proxy IP address and rate limiting
// https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
app.set('trust proxy', 1);

// app.options('*', cors(corsOptions)); // Pre-flight request for all routes
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', corsOptions.origin);
//   res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
//   res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
//   next();
// });

app.use(cors(corsOptions));
app.use(express.json());
app.use(optimization.apiLimiter);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BucketLab API Root'
  });
});

app.use('/v1', (req, res, next) => {
  console.log('Request received at:', req.requestTime);
  next();
});

app.use(authRoutes);
app.use('/v1/accounts', accounts);
app.use('/v1/messages', messages);
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    fail_type: 'server_error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;