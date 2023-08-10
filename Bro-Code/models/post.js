const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    img_vid_URL: {
      type: String,
    },
    description: {
      type: String,
    },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        message: { type: String, max: 500 },
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hashtags: {
      type: Array,
      default: [],
    },

    shares: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
