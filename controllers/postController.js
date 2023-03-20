const Post = require('../models/postModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({
    caption: req.body.caption,
    image: {
      public_id: 'public_url_here',
      url: 'image_url_here',
    },
    owner: req.user._id,
  });
  if (!post) {
    return next(new AppError('Post not created, try again!', 401));
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('Please login to create Post!', 401));
  }

  user.posts.push(post._id);
  await user.save();

  res.status(201).json({
    status: 'success',
    data: post,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError('Post not found, try again!', 401));
  }
  console.log(post.owner.toString(), req.user.id);
  if (post.owner.toString() === req.user.id) {
    //await Post.deleteOne(req.params.id);
    post.deleteOne();

    // we need to remove deleted post id from user model
    const user = await User.findById(req.user.id);
    const index = user.posts.indexOf(req.params.id);
    console.log(index);
    user.posts.splice(index, 1);
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Post deleted',
    });
  } else {
    return next(
      new AppError('you are not authoized to delete this post!', 401)
    );
  }
});

exports.likeAndUnlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    next(new AppError('Post not Found', 401));
  }

  if (post.likes.includes(req.user._id)) {
    const index = post.likes.indexOf(req.user._id);
    post.likes.splice(index, 1);
    await post.save();

    return res.status(201).json({
      status: 'success',
      data: 'Post unliked',
    });
  } else {
    post.likes.push(req.user._id);
    await post.save();

    return res.status(201).json({
      status: 'success',
      data: 'Post liked',
    });
  }
});

// exports.followUnfollow = catchAsync(async (req, res, next) => {
// const loggedInUser = await User.findById(req.user.id);
// const userToFollow = await User.

// });
