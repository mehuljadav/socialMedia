const mongoose = require('mongoose');
const validator = require('validator');

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
    public_id: String,
    url: String,
  },
  password: {
    type: String,
    minlength: [6, 'Password must be 6 character long!'],
    required: [true, 'User must provide Password!'],
    select: false,
  },
  passwordconfirm: {
    type: String,
    required: [true, 'User must provide Password!'],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Post,
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
