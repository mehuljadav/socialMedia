const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'config/config.env' });

//
//
// Signup User
//

const createWebToken = async (user, statusCode, req, res, msg) => {
  // 1 Creating Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // 2 Sending Token via cookie
  res.cookie('token', token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
  user.password = undefined;
  console.log(msg);
  res.status(statusCode).json({
    status: 'success',
    token,
    msg,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  if (!user) {
    return next(new appError('All fields are mendatory!', 401));
  }

  createWebToken(user, 201, req, res);
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Please provide Email and Password!', 401));
  }
  const user = await User.findOne({ email }).select('+password +active');
  console.log(user);
  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new appError('Username or Password are wrong!', 401));
  if (user.active === false) {
    user.active = true;
    await user.save();
    const msg = 'welcome back';
    createWebToken(user, 201, req, res, msg);
    console.log('way from here');
  }
  user.active = true;
  await user.save();

  createWebToken(user, 201, req, res);
  next();
});

exports.logout = catchAsync(async (req, res, next) => {
  res
    .cookie('token', 'loggedout', {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      status: 'success',
      data: 'Logout successful!',
    });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return next(new appError('You are not allowed to access this route.', 401));
  }

  const decodedUser = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  if (!decodedUser) {
    return next(
      new appError('User Authentication failed, Please login again.', 401)
    );
  }

  const frashUser = await User.findById(decodedUser.id);
  if (!frashUser) {
    return next(
      new appError('User not found with this token,  Please login again.', 401)
    );
  }

  req.user = frashUser;
  next();
});
