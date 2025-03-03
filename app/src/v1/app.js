const morgan = require('morgan');
const express = require('express');
const app = express();
const optimization = require('../optimization/index.js');
const cors = require('cors');
const accounts = require('./routes/accountRoutes.js');
const messages = require('./routes/messageRoutes.js');

const { DEV_URL, PROD_URL, NODE_ENV } = process.env;

const whitelist = ['https://localhost:4020', 'https://bucketlab.io', 'https://www.api.bucketlab.io'];
const corsOptions = { 
  origin: whitelist,
  optionsSuccessStatus: 200,
  methods: 'GET, POST, PUT, DELETE, PATCH',
  allowedHeaders: 'Content-Type, Authorization',
};

// const corsOptionsDelegate = (req, callback) => {
//   let corsOps;
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOps = { origin: true };
//   } else {
//     corsOpts = { origin: false };
//   };
//   callback(null, corsOpts);
// };

if (NODE_ENV === 'development') {
  corsOptions.origin = DEV_URL;
  app.use(morgan('dev'));
  console.log('Development mode: Morgan logging enabled');
  console.log(`Development mode: CORS enabled for ${DEV_URL}`);
};

// if (NODE_ENV === 'production') {
//   console.log(`CORS enabled for ${corsOptions.origin}`);
// };

console.log('corsOptions:', corsOptions);

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

app.use('/v1/accounts', accounts);

app.use('/v1/messages', messages);
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;