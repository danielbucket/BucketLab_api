const router = require('express').Router();
const cors = require('cors');
const { POST } = require('../controllers/AuthenticationController/index.js');

router.route('/create')
  .post(cors(), POST.createAuthentication);

router.route('/login')
  .post(cors(), POST.loginAuthorization);

module.exports = router;