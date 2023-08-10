const Post = require("../models/post");
const fs = require("fs");
const { generateToken, verifyToken } = require("../utils/jwtToken");
const validateMongoId = require("../utils/validateMongo");
const { generateHash, compareHash } = require("../utils/password");
const postSchema = require("../views/post");

let postControllers = {};

postControllers.createPost = async (req, res) => {
  try {
    const { error } = postSchema.createPostSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const { description, hashtags } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Image/Video file is required" });
    }
    let createdPost = await Post.create({
      description: description ? description : "",
      hashtags,
      author: req.user?._id,
      img_vid_URL: req.file.path,
    });
    if (!createdPost) {
      return res.status(400).json({ error: "Unable to create a post" });
    }
    return res.status(200).json(createdPost);
  } catch (err) {
    return res.send(500).json({ message: "Internal error" });
  }
};
postControllers.deletePost = async (req, res) => {
  try {
    let postId = req.params.id;
    if (!validateMongoId(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }
    let deletedPost = Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(400).json({ error: "Failed to delete a post" });
    }
    return res.status(200).json({ error: "Successfuly deleted the post" });
  } catch (err) {
    return res.send(500).json({ message: "Internal error" });
  }
};
postControllers.updatePost = async (req, res) => {
  try {
    let postId = req.params.id;
    if (!validateMongoId(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }
    const { error } = postSchema.updatePostSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Invalid Body " });
    }
    req.body.author=req.user?._id
    let updatePost = Post.findByIdAndUpdate(postId,req.body,{new:true})
    if (!updatePost) {
      return res.status(400).json({ error: "Failed to update a post" });
    }
    return res.status(200).json(updatePost);
} catch (err) {
    return res.send(500).json({ message: "Internal error" ,error:err.message });
}
};

postControllers.hashTagPostSearch=async(req,res) =>{
    const { error } = postSchema.hashCategorisePostSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Invalid Body " });
    }
    const hashtagArray = req.body.tags;
    let categorisedPosts = Post.find({$in:{hashtags:hashtagArray}});
    if (!categorisedPosts){
        return res.status(400).json({ error: "Failed to update a post" }).select(img_vid_URL,author,likes,comment);
    }
    return res.status(200).json(categorisedPosts);
}