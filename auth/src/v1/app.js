const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');

const corsOptions = {
  origin: process.env.ORIGIN_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.set('trust proxy', true);

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BucketLab Authorization API root endpoint.',
  });
});

app.use('/auth', authRoutes);

module.exports = app;