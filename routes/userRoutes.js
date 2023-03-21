const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
//
//
// Routes
//

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get(
  '/follow/:id',
  authController.protect,
  postController.followUnfollow
);

module.exports = router;
