const morgan = require('morgan');
const express = require('express');
const app = express();
const optimization = require('../optimization/index.js');
const cors = require('cors');
const accounts = require('./routes/accountRoutes.js');
const messages = require('./routes/messageRoutes.js');

const { DEV_URL, NODE_ENV } = process.env;

const whitelist = ['http://localhost:5173', 'https://bucketlab.io', 'https://api.bucketlab.io', 'https://www.bucketlab.io'];

const corsOptions = {
  origin: (origin, cb) => {
    if (whitelist.indexOf(origin) !== -1) {
      cb(null, true);
    } else {
      cb(new Error('That domain is not whitelisted for CORS'));
    };
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 204,
  preflightContinue: false
};

if (NODE_ENV === 'development') {
  // corsOptions.origin = DEV_URL;
  app.use(morgan('dev'));
  console.log('Development mode: Morgan logging enabled');
  console.log(`Development mode: CORS enabled for ${corsOptions.origin}`);
};

if (NODE_ENV === 'production') {
  console.log(`CORS enabled for ${corsOptions.origin}`);
};

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

app.use('/api/v1/accounts', accounts);
app.use('/api/v1/messages', messages);
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    fail_type: 'server_error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;