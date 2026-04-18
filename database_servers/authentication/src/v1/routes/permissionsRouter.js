const router = require('express').Router();
const cors = require('cors');
const { GET } = require('../controllers/PermissionsController/index.js');

const { permissionsList } = require('../utils/permissionsList.js');

router.route('/request-permissions')
  .GET(cors(), GET.requestPermissions);