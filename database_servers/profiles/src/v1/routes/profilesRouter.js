const router = require('express').Router();
const cors = require('cors');
const { authorize } = require('../middleware/authorize.js');
const { POST, PATCH, DELETE, GET } = require('../controllers/ProfilesController/index.js');

router.route('/create')
  .post(cors(), POST.createProfile);

router.route('/login')
  .post(cors(), POST.loginProfile);

router.route('/logout/:id')
  .post(cors(), POST.logoutProfileByProfileId);
 

// router.route('/avatar/upload/:id')
//   .post(cors(), authorize, POST.uploadAvatar);

// router.route('/avatar/:id')
//   .delete(cors(), authorize, DELETE.deleteAvatar)
//   .get(cors(), GET.getAvatar);

// router.route('/')
  // .get(cors(), GET.getAllProfiles);



router.route('/:id')
  .get(cors(), authorize, GET.getProfileByProfileId);

router.route('/:id/update')
  .patch(cors(), authorize, PATCH.updateProfileByProfileId);
  
router.route('/:id/delete')
  .delete(cors(), authorize, DELETE.deleteProfileByProfileId);

router.route('/unsecureProfileById/:id')
  .get(cors(), GET.getProfileByProfileId);
  
// router.route('/refresh-token')
//   .post(cors(), POST.refreshToken);

module.exports = router;