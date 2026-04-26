const router = require('express').Router();
const cors = require('cors');
const { GET } = require('../../../../administration/src/v1/controllers/PermissionsController/index.js');

router.route('/request-permissions')
  .get(cors(), GET.requestPermissions);

module.exports = router;