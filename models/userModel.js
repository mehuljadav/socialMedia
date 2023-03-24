const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { find } = require('./postModel');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name!'],
    trime: true,
    maxlength: [20, 'Name should smaller then 20 Character'],
    validate: {
      validator: function (v) {
        return validator.isAlpha(v, 'en-US', { ignore: ' ' });
      },
      message: `Name should conains only valid alphabates!`,
    },
  },
  email: {
    type: String,
    required: [true, 'User must provide Email Address!'],
    validate: [validator.isEmail, 'incorrect Email Address!'],
    unique: true,
    trime: true,
    lowercase: true,
  },
  avatar: {
    // public_id: String,
    // url: String,
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    minlength: [6, 'Password must be 6 character long!'],
    required: [true, 'User must provide Password!'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: async function (pc) {
        return pc === this.password;
      },
      message: `Passwords doesn't match!`,
    },
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//
//
//  Password bcryption
//
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//
//
// Compare Password
//
userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  //console.log(candidatePassword, userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre(/^find/, async function (next) {
  if (this.op === 'find') {
    this.find({ active: { $ne: false } });
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
