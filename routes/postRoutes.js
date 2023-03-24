const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
//
//
// Routes
//

router
  .route('/')
  .post(authController.protect, postController.createPost)
  .get(authController.protect, postController.getPostOfFollowing);

router
  .route('/:id')
  .get(authController.protect, postController.likeAndUnlikePost)
  .post(authController.protect, postController.updatePostCaption)
  .delete(authController.protect, postController.deletePost);

module.exports = router;
