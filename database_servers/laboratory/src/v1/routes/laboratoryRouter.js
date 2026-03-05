const router = require('express').Router();
const cors = require('cors');
const { POST, PATCH, DELETE, GET } = require('../controllers/LaboratoryController/index.js');

router.route('/')
  .get(cors(), GET.getAllLaboratories)
  .post(cors(), POST.newLaboratory);
  
router.route('/me')
  .get(cors(), authorize, GET.getLaboratoryByToken);
router.route('/:id')
  .get(cors(), authorize, GET.getLaboratoryByLaboratoryId)
  .patch(cors(), authorize, PATCH.updateLaboratoryByLaboratoryId)
  .delete(cors(), authorize, DELETE.deleteLaboratoryByLaboratoryId);

router.route('/login')
  .post(cors(), POST.loginLaboratory);

router.route('/logout/:id')
  .post(cors(), POST.logoutLaboratoryByLaboratoryId);

router.route('/unsecureLaboratoryById/:id')
  .get(cors(), GET.getLaboratoryByLaboratoryId);

module.exports = router;