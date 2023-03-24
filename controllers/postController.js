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

  user.posts.push(post);
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

exports.followUnfollow = catchAsync(async (req, res, next) => {
  const loggedInUser = await User.findById(req.user.id);
  const userToFollow = await User.findById(req.params.id);

  if (!loggedInUser) {
    return next(new AppError('Please login to follow users!', 401));
  }
  if (!userToFollow) {
    return next(new AppError('User you trying to follow does not exist!', 401));
  }

  if (loggedInUser.following.includes(userToFollow.id)) {
    //
    // means loggedIn user is following

    const indexFolloing = loggedInUser.following.indexOf(loggedInUser.id);
    loggedInUser.following.splice(indexFolloing, 1);

    const indexFollower = userToFollow.followers.indexOf(loggedInUser.id);
    userToFollow.followers.splice(indexFollower, 1);

    await loggedInUser.save();
    await userToFollow.save();

    return res.status(200).json({
      status: 'success',
      message: 'User Unfollowed',
    });
  } else {
    console.log('Gopal id', userToFollow.id, 'mj id', loggedInUser.id);
    loggedInUser.following.push(userToFollow.id);
    userToFollow.followers.push(loggedInUser.id);

    await loggedInUser.save();
    await userToFollow.save();

    return res.status(200).json({
      status: 'success',
      message: 'User Followed',
    });
  }
});

// Task : get all post of following user
exports.getPostOfFollowing = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User not found!', 401));

  const posts = await Post.find({
    owner: {
      $in: user.following,
    },
  });

  res.status(200).json({
    status: 'success',
    data: posts,
  });
});

exports.updatePostCaption = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError('Post not found!', 401));
  }
  console.log(post);
  if (post.owner.toString() === req.user.id) {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { caption: req.body.caption },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      status: 'success',
      data: updatedPost,
    });
  } else {
    return next(new AppError('You are not authorized to edit this post', 401));
  }
});
