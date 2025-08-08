const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');
const { corsConfig } = require('../optimization/corsConfig.js');

app.set('trust proxy', true); // Trust proxy for CORS handling

app.use(cors(corsConfig()));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BucketLab Auth API root endpoint.',
  });
});

app.use('/', (req, res, next) => {
  console.log(`Request received at Auth_Server: ${req.requestTime} for ${req.originalUrl}`);
  next();
});

app.use('/auth', authRoutes);

module.exports = app;