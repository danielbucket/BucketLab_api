const express = require('express');
const app = express();
const optimization = require('../optimization');
const cors = require('cors');
const messages = require('./routes/messageRoutes.js');

const corsOptions = {
  origin: process.env.ORIGIN_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BucketLab Laboratory API root endpoint.',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });
});

app.use('/v1', messages);

module.exports = app;