const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'config/config.env' });

//
//
// Signup User
//

const createWebToken = async (user, statusCode, req, res) => {
  // 1 Creating Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // 2 Sending Token via cookie
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  console.log(token);
  res.status(statusCode).json({
    status: 'success',
    token,
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
  const user = await User.findOne({ email }).select('password');

  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new appError('Username or Password are wrong!', 401));

  createWebToken(user, 201, req, res);
  next();
});
