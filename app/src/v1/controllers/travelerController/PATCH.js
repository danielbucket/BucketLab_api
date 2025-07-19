const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Traveler = require('../../models/traveler.model');

const MONGO_URI = process.env.MONGO_URI;

exports.updateTraveler = async (req, res) => {
  const id = req.params.id.slice(1);
  const { body } = req;
  
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
  };

  Object.keys(body).forEach((key) => {
    if (doc[key]) {
      doc[key] = body[key];
    } else {
      return res.status(404).json({
        status: 'fail',
        message: `The key: '${key}' cannot be updated.`
      });
    };
  });

  doc.updated_at = Date.now();
  const saved = await doc.save();
  
  if (!saved) {
    return res.status(500).json({
      status: 'error',
      message: 'Traveler update failed.'
    });
  } else {
    return res.status(200).json({
      status: 'success',
      data: { saved }
    });
  };
};

exports.travelerLogout = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', () => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.'
    });
  });

  if (!ObjectId.isValid(id)) {
    return res.status(422).json({
      status: 'error',
      message: 'Invalid ID format.'
    });
  };

  const doc = await Traveler.findById({ _id: id });

  if (!doc) {
    return res.status(404).json({
      id,
      status: 'fail',
      message: 'No traveler found with that ID.'
    });
  };

  doc.logged_in = false;
  doc.logged_in_at = null;

  const saved = await doc.save();

  if (!saved) {
    return res.status(500).json({
      status: 'error',
      message: 'Document failed to save to the database.'
    });
  } else {
    return res.status(200).json({
      status: 'success'
    });
  };
};