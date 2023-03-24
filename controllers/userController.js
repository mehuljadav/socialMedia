const User = require('../models/userModel');
const Post = require('../models/postModel');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createUser = async (req, res, next) => {};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(
      new AppError('Please enter both Old and New Password to update it!', 401)
    );
  }
  const user = await User.findById(req.user.id).select('+password');
  if (!user)
    return next(new AppError('Please login to update your Password', 401));

  const decodedUser = await user.comparePassword(oldPassword, user.password);
  if (!decodedUser)
    return next(new AppError('Old Password is not valid!', 401));

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'password Updated Successfully',
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  );
  res.status(201).json({
    status: 'success',
    data: user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  if (!req.user) return next(new AppError('Unauthorized', 401));

  await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    { new: true, runValidators: true }
  );

  await Post.updateMany(
    { owner: req.user.id },
    { active: false, select: false }
  );

  return res
    .cookie('token', 'loggedOut', {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(204)
    .json({
      status: 'success',
      message: 'User deactivated',
    });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json({
    status: 'success',
    data: users,
  });
});
