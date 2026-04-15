const router = require('express').Router();
const cors = require('cors');
const { GET } = require('../controllers/LaboratoryController/index.js');

router.route('/resume')
  .get(cors(), GET.getResume)


module.exports = router;