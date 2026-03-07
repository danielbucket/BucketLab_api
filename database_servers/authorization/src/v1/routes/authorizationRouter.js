const router = require('express').Router();
const cors = require('cors');
// const { POST, PATCH, DELETE, GET } = require('../controllers/AuthorizationController/index.js');

// router.route('/')
//   .get(cors(), GET.getAllAuthorizations)
//   .post(cors(), POST.newAuthorization);
  
// router.route('/me')
//   .get(cors(), authorize, GET.getAuthorizationByToken);
// router.route('/:id')
//   .get(cors(), authorize, GET.getAuthorizationById)
//   .patch(cors(), authorize, PATCH.updateAuthorizationById)
//   .delete(cors(), authorize, DELETE.deleteAuthorizationById);

// router.route('/login')
//   .post(cors(), POST.loginAuthorization);

// router.route('/logout/:id')
//   .post(cors(), POST.logoutAuthorizationById);

// router.route('/unsecureAuthorizationById/:id')
//   .get(cors(), GET.getAuthorizationById);

module.exports = router;