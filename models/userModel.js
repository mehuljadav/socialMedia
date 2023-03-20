const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name!'],
    trime: true,
  },
  email: {
    type: String,
    required: [true, 'User must provide Email Address!'],
    validate: [validator.isEmail, 'incorrect Email Address!'],
    unique: true,
    trime: true,
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
  console.log(candidatePassword, userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
