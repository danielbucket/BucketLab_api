const router = require('express').Router();
const cors = require('cors');
const { POST, PATCH, DELETE, GET } = require('../controllers/ProfilesController/index.js');
const { jwtAuthMiddleware } = require('../middleware/jwtAuthMiddleware.js');

router.route('/create')
  .post(cors(), POST.createProfile);

router.route('/:id')
  .get(cors(), jwtAuthMiddleware, GET.getProfileByProfileId);
 

// router.route('/avatar/upload/:id')
//   .post(cors(), authorize, POST.uploadAvatar);

// router.route('/avatar/:id')
//   .delete(cors(), authorize, DELETE.deleteAvatar)
//   .get(cors(), GET.getAvatar);

// router.route('/')
  // .get(cors(), GET.getAllProfiles);



// router.route('/:id/update')
//   .patch(cors(), authorize, PATCH.updateProfileByProfileId);
  
// router.route('/:id/delete')
//   .delete(cors(), authorize, DELETE.deleteProfileByProfileId);

// router.route('/unsecureProfileById/:id')
//   .get(cors(), GET.getProfileByProfileId);
  
// router.route('/refresh-token')
//   .post(cors(), POST.refreshToken);

module.exports = router;