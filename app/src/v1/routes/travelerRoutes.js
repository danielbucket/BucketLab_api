const express = require('express');
const cors = require('cors');

const {
  deleteTraveler,
  createTraveler,
  getAllTravelers,
  getTravelerByID,
  updateTraveler,
  travelerLogin,
  travelerLogout,
} = require('../controllers/travelerController');
const { validateToken, checkID } = require('../middleware/authMiddleware');

const router = express.Router();
const getConfig = { methods: ['GET'] };
const postConfig = { methods: ['POST'] };
const patchConfig = { methods: ['PATCH'] };
const deleteConfig = { methods: ['DELETE'] };

// checkID will only be called if the parameter 'id' is present in the URL
router.param('id', checkID);

router.route('/')
  .get(cors(getConfig), getAllTravelers)
  .post(cors(postConfig), createTraveler);

router.route('/login')
  .post(cors(postConfig), travelerLogin);

router.route('/logout/:id')
  .patch(cors(patchConfig), travelerLogout);

router.route('/:id')
  .get(cors(postConfig), getTravelerByID)
  .patch(cors(patchConfig), updateTraveler)
  .delete(cors(deleteConfig), deleteTraveler);

module.exports = router;