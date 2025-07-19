const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Traveler = require('../../models/traveler.model');

const MONGO_URI = process.env.MONGO_URI;

exports.deleteTraveler = async (req, res) => {
  const id = req.params.id.slice(1);

  mongoose.connect(MONGO_URI);
  mongoose.connection.on('error', (err) => {
    return res.status(500).json({
      status: 'error',
      message: 'Database connection error.',
      err
    });
  });

  const doc = await Traveler.findById({ _id: id });

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No traveler found with that ID.'
    });
  };
  
  const deleted = await doc.deleteOne();

  if (!deleted) {
    return res.status(500).json({
      status: 'error',
      message: 'Account deletion failed.'
    });
  } else {
    return res.status(204).json({
      status: 'success',
      data: null
    });
  };
};