const express = require('express');
const app = express();
const cors = require('cors');
const messages = require('./routes/messageRoutes.js');
const { corsConfig } = require('./optimization/corsConfig.js');

app.set('trust proxy', true);

app.use(cors(corsConfig()));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BucketLab Laboratory API root endpoint.',
  });
});

app.use('/', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Request received at Laboratory_Server @ ${req.requestTime}`);
  next();
});

app.use('/messages', messages);

module.exports = app;