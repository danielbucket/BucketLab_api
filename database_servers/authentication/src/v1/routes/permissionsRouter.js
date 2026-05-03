const router = require('express').Router();
const cors = require('cors');
const { GET } = require('../controllers/PermissionsController/GET/index.js');

router.route('/request-permissions')
  .get(cors(), GET.requestPermissions);

module.exports = router;