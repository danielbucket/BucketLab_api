const express = require('express');
const app = express();
const cors = require('cors');
const { corsConfig } = require('./optimization/corsConfig.js');
const accessRoutes = require('./routes/accessRoutes.js');

app.set('trust proxy', true);

app.use(cors(corsConfig()));
app.use(express.json());

app.use('/', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Request received at Access Analytics Server @ ${req.requestTime} for ${req.originalUrl}`);
  console.log(`Request method: ${req.method}, path: ${req.path}, params:`, req.params);
  next();
});

app.use('/access', accessRoutes);

app.all('/*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    fail_type: 'server_error',
    message: `Can't find ${req.originalUrl} on this server!`
  })
});

module.exports = app;