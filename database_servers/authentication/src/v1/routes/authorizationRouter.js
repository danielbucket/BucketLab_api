const router = require('express').Router();
const cors = require('cors');
const { POST } = require('../controllers/AuthorizationController/index.js');

// router.route('/')
//   .get(cors(), GET.getAllAuthorizations)
//   .post(cors(), POST.newAuthorization);
  
// router.route('/:id')
//   .get(cors(), authorize, GET.getAuthorizationById)
//   .patch(cors(), authorize, PATCH.updateAuthorizationById)
//   .delete(cors(), authorize, DELETE.deleteAuthorizationById);

router.route('/login')
  .post(cors(), POST.loginAuthorization);

router.route('/register')
  .post(cors(), POST.registerAuthorization);

// router.route('/refresh-token')
//   .post(cors(), POST.refreshTokenAuthorization);

// router.route('/logout/:id')
//   .post(cors(), POST.logoutAuthorizationByProfileId);

// router.route('/unsecureAuthorizationById/:id')
//   .get(cors(), GET.getAuthorizationById);

module.exports = router;