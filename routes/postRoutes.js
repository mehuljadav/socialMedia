const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
//
//
// Routes
//

router.post('/', authController.protect, postController.createPost);
router.get('/:id', authController.protect, postController.likeAndUnlikePost);

//
// Get All Posts of Following User
//
router.get('/', authController.protect, postController.getPostOfFollowing);

//
// Delete Post
//
router.delete('/:id', authController.protect, postController.deletePost);

module.exports = router;
