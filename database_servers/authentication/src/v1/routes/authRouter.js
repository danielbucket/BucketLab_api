const router = require('express').Router();
const cors = require('cors');
const { POST } = require('../controllers/AuthenticationController/index.js');

router.route('/create')
  .post(cors(), POST.createAuthentication);

router.route('/login')
  .post(cors(), POST.loginAuthorization);

router.route('/logout')
  .post(cors(), POST.logout);

module.exports = router;