const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

//
//
// Routes
//

router.post('/post', postController.createPost);

module.exports = router;
