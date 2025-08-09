const express = require('express');
const app = express();
const cors = require('cors');
const messagesRouter = require('./routes/messageRouter.js');
const { corsConfig } = require('./optimization/corsConfig.js');

app.set('trust proxy', true);

app.use(cors(corsConfig()));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BucketLab Empire Laboratory API root endpoint.',
  });
});

app.use('/', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Request received at Laboratory_Server @ ${req.requestTime}`);
  next();
});

app.use('/messages', messagesRouter);

app.all('/*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    fail_type: 'server_error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;