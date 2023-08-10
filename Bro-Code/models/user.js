const { boolean } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  { username: {
      type: String, required: true,min: 3,max: 15,unique: true,},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageURL: { type: String, default: "" },
    description: {
      type: String,
      max: 100,
      default: "",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
       gender: {
      type: String,
      enum: ["male", "female"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
