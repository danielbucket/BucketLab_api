const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./routes/authRouter.js');
const permissionsRouter = require('./routes/permissionsRouter.js');
const { permissionsMiddlware } = require('./middleware/permissionsMiddleware.js');
const { corsConfig } = require('./optimization/corsConfig.js');

app.set('trust proxy', true);

app.use(cors(corsConfig()));
app.use(express.json());

app.use('/', (req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Request received at Authentication Server @ ${req.requestTime} for ${req.originalUrl}`);
  console.log(`Request method: ${req.method}, path: ${req.path}, params:`, req.params);
  next();
});

app.use('/permissions', permissionsMiddleware, permissionsRouter);
app.use('/', authRouter);

app.all('/*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    fail_type: 'server_error',
    message: `Can't find ${req.originalUrl} on this server!`
  })
});

module.exports = app;