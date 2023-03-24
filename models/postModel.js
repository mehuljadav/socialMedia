const mongoose = require('mongoose');
const validator = require('validator');

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    minlength: [1, 'Caption must be bigger then 1 Character'],
    maxlength: [50, 'Caption must be smaller then 50 Character'],
    validate: {
      validator: function (v) {
        return validator.isAlphanumeric(v, 'en-US', { ignore: ' \'"' });
      },
      message: 'Post Caption can only contain Alphabates and Numbers',
    },
  },
  image: {
    public_id: String,
    url: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // multiple user gooing to likes so it will be array
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      Comment: {
        type: String,
        required: true,
      },
    },
  ],

  active: {
    type: Boolean,
    default: true,
    select: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

postSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });

  next();
});

module.exports = mongoose.model('Post', postSchema);
