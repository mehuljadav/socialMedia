const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
//
//
// Routes
//

router.post('/post', authController.protect, postController.createPost);
router.get(
  '/post/:id',
  authController.protect,
  postController.likeAndUnlikePost
);
// router.post('/post/:id', authController.protect, postController.followUnfollow);

router.delete('/post/:id', authController.protect, postController.deletePost);

module.exports = router;
