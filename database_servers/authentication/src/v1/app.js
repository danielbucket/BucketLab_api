const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/authRouter.js');
const { corsConfig } = require('./optimization/corsConfig.js');

app.set('trust proxy', true);

app.use(cors(corsConfig()));
app.use(express.json());

app.use('/', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  // make a creative log message that includes the request method, path, and params with some styling for better visibility in the logs
  console.log(`\n--- Incoming Request ---`);
  console.log(`Time: ${req.requestTime}`);
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Params:`, req.params);
  console.log(`-----------------------\n`);
  next();
});


app.use('/', authRouter);

app.all('/*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    fail_type: 'server_error',
    message: `Can't find ${req.originalUrl} on this server!`
  })
});

module.exports = app;