const router = require('express').Router();
const cors = require('cors');
const { POST, PATCH, DELETE, GET } = require('../controllers/ProfilesController/index.js');
const { jwtAuthMiddleware } = require('../middleware/jwtAuthMiddleware.js');

router.route('/create')
  .post(cors(), POST.createProfile);

router.route('/me')
  .get(cors(), jwtAuthMiddleware, GET.getProfileByToken);
 
router.route('/update')
  .patch(cors(), jwtAuthMiddleware, PATCH.updateProfileByProfileToken);

router.route('/delete/:id')
  .delete(cors(), DELETE.deleteProfile);
  
// router.route('/refresh-token')
//   .post(cors(), POST.refreshToken);

module.exports = router;