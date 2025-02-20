const morgan = require('morgan');
const express = require('express');
const app = express();
const optimization = require('../optimization/index.js');
const cors = require('cors');

const routes = require('./routes/accountRoutes.js');
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:5173'
  ]
};

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
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
    data: {
      message: 'BucketLab API'
    }
  });
});

app.use('/api/v1/accounts', routes);

module.exports = app;