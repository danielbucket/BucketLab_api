const router = require('express').Router();
const cors = require('cors');
const { POST } = require('../controllers/AuthenticationController/index.js');

router.route('/create')
  .post(cors(), POST.createAccessRecord);

module.exports = router;