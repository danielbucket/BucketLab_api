const { deleteTraveler } = require('./DELETE');
const { createTraveler } = require('./POST');
const { getAllTravelers } = require('./GET');
const { getTravelerByID } = require('./GET');
const { updateTraveler } = require('./PATCH');
const { travelerLogin } = require('./POST');
const { travelerLogout } = require('./PATCH');

module.exports = {
  deleteTraveler,
  createTraveler,
  getAllTravelers,
  getTravelerByID,
  updateTraveler,
  travelerLogin,
  travelerLogout
};