const express = require('express');
const app = express();
const cors = require('cors');
const messages = require('./routes/messageRoutes.js');
const { corsConfig } = require('../optimization/corsConfig.js');

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
  console.log(`Request received at Laboratory_Server @ ${new Date().toISOString()}`);
  next();
});

app.use('/messages', messages);

module.exports = app;