const morgan = require('morgan');
const express = require('express');
const app = express();
const optimization = require('../optimization/index.js');
const cors = require('cors');
const accounts = require('./routes/accountRoutes.js');
const messages = require('./routes/messageRoutes.js');

const { DEV_URL, PROD_URL, NODE_ENV } = process.env;
const corsOptions = { origin: PROD_URL };

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
  corsOptions.origin = DEV_URL;
  console.log(`Development mode: CORS enabled for ${DEV_URL}`);
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
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;