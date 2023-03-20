const User = require('../models/postModel');

exports.createPost = async (req, res, next) => {
  try {
    const newPost = {};
  } catch (error) {
    res.status(500).json({
      status: 'success',
      data: post,
    });
  }
};
