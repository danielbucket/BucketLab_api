const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Traveler = require('../../models/traveler.model');

const MONGO_URI = process.env.MONGO_URI;

exports.getAllTravelers = async (req, res) => {
  console.log('MONGO_URI: ', MONGO_URI);
  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  const found = await Traveler.find({});

  if (!found) {
    return res.status(404).json({
      status: 'fail',
      message: 'No travelers found.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      results: found.length,
      data: { found }
    });
  };
};

exports.getTravelerByID = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  const doc = await Traveler.findById({ _id: id });

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No traveler found with that ID.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      data: { doc }
    });
  };
};