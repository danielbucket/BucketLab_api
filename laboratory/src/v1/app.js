const express = require('express');
const app = express();
const cors = require('cors');
const messages = require('./routes/messageRoutes.js');

const corsOptions = {
  origin: process.env.ORIGIN_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BucketLab Laboratory API root endpoint.',
  });
});

app.use('/messages', messages);

module.exports = app;