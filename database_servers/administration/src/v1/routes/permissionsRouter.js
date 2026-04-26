const router = require('express').Router();
const cors = require('cors');
const { GET, POST } = require('../controllers/PermissionsController/index.js');
const { permissionsMiddleware } = require('../middleware/permissionsMiddleware.js');

// Request a new permission (user initiates)
router.route('/request')
  .get(cors(), permissionsMiddleware, GET.requestPermissions);

// Initialize the Administration singleton (only callable once, requires 'empire' permission)
router.route('/initialize-singleton')
  .post(cors(), permissionsMiddleware, POST.initializeSingleton);

module.exports = router;