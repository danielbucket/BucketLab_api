const router = require('express').Router();
const cors = require('cors');
const { GET } = require('../controllers/HomelabController/index.js');

router.route('/status')
  .get(cors(), GET.getHomelabStatus);

module.exports = router;