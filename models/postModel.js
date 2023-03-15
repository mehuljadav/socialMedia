const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  caption: {
    typeof: String,
  },
  image: {
    public_id: String,
    url: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // multiple user gooing to likes so it will be array
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
      Comment: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Post', postSchema);
