const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
//
//
// Routes
//

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.get('/getAllUsers', authController.protect, userController.getAllUser);
router.post(
  '/updatePassword',
  authController.protect,
  userController.updatePassword
);

router.post(
  '/updateProfile',
  authController.protect,
  userController.updateProfile
);
router.get(
  '/follow/:id',
  authController.protect,
  postController.followUnfollow
);

module.exports = router;
