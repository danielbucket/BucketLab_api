const router = require('express').Router();
const cors = require('cors');
const { GET, POST } = require('../controllers/PermissionsController/index.js');

// Request a new permission (user initiates)
router.route('/request')
  .get(cors(), GET.requestPermissions);

// Initialize the Administration singleton (only callable once, requires 'empire' permission)
router.route('/initialize-singleton')
  .post(cors(), POST.initializeSingleton);

module.exports = router;