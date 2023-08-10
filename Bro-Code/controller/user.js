const User = require("../models/user");
const Post = require("../models/post");
const fs = require("fs");
const { generateToken, verifyToken } = require("../utils/jwtToken");
const validateMongoId = require("../utils/validateMongo");
const userSchema = require("../views/user");
const { generateHash, compareHash } = require("../utils/password");


const userControllers = {};

// Register Route------------------>
userControllers.register = async (req, res) => {
  const { error } = userSchema.registrationSchema.validate(req.body);
  if (error) {
    throw new Error(error.message);
  }
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = generateHash(password);
      user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      res.status(200).json(user);
    } else {
      res.status(400).json({
        message:
          "User with provided creentials all ready exists move to login page",
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// login ------------------>
userControllers.login = async (req, res) => {
  const { error } = userSchema.loginSchema.validate(req.body);
  if (error) {
    throw new Error("Incorrect Values");
  }
  let { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      let hash = user.password;
      if (!compareHash(password, hash)) {
        res.status(400).json({ message: "Invalid Credentials" });
      } else {
        let token = generateToken(user?._id, email);
        if (token) {
          res.status(200).json({
            username: user?.username,
            email,
            token: token,
          });
        }
      }
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

//-----------------Profile update---------->>
userControllers.profile = async (req, res) => {
  try {
    let id = req.user?._id;
    if (!validateMongoId(id)) {
      return res.status(404).json({ message: "invalid id" });
    }
    const { error } = userSchema.profileSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: "Incorrect Values: " + error.message });
    }
    let updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(400).json({ message: "Profile Can't be updated"});
    }
    return res.status(200).json(updatedUser);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in profile updation", error: err.message });
  }
};

// Set Avatar Image -------------->
userControllers.avatar = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (req.file) {
      const newProfileImageURL = req.file.path;
      // If the user is updating their profile image, delete the old profile image from the server
      if (req.user?.profileImageURL) {
        fs.unlink(req.user?.profileImageURL, (err) => {
          if (err) {
            console.error("Error deleting old profile image:", err);
          }
        });
      }
      const updateUser = await User.findByIdAndUpdate(
        userId,
        { profileImageURL: newProfileImageURL },
        { new: true }
      );
      if (!updateUser) {
        return res.status(404).json({ error: "User not found." });
      }
      return res.status(200).json(updateUser);
    } else {
      return res.status(400).json({ error: "No image file provided." });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Follow User ------------------------------------>
userControllers.follow = async (req, res) => {
  try {
    const userToFollowId = req.params.id;
    if (!validateMongoId(userToFollowId)) {
      return res
        .status(400)
        .json({ message: "Invalid mongoid", error: err.message });
    }
    const userId = req.user?._id;
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User Not Found" });
    }
    if (userToFollow.followers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user." });
    }
    await User.findByIdAndUpdate(userId, {
      $push: { following: userToFollowId },
    });
    res.status(200).json({ message: "User followed successfully." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// Unfollow a user -------------------------------------------->
userControllers.unfollowUser = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id; 
    const userToUnfollowId = req.params.id; 
    const userToUnfollow = await User.findById(userToUnfollowId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found.' });
    }  
    if (!userToUnfollow.followers.includes(loggedInUserId)) {
      return res.status(400).json({ message: 'You are not following this user.' });
    }
    await User.findByIdAndUpdate(loggedInUserId, { $pull: { following: userToUnfollowId } });
    res.status(200).json({ message: 'User unfollowed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};
//Search User by username -------------------------------------------------->
userControllers.searchUser =async(req,res)=>{
  try{
    let serachedUsername= req.params.username;
    let searchedUser = await User.findOne({username:serachedUsername})
    if(!searchedUser){
    return res.status(404).json({message:"No user was found with provided name"})
    }
    return res.status(200).json(searchedUser)
  }catch(err){
    res.status(500).json({ message: 'Internal server error.' });
    
  }
}

userControllers.likePost =async(req,res)=>{
  try{
    let postId = req.params.id;
    let userId = req.user?._id;
    if(!validateMongoId(postId)){
      return res.status(400).json({message:"Invalid Id"});
    }
    if(req.user?.likedPosts.includes(postId)){
      // so if user has already liked the post and click on like again so we gona remove it from liked post
      let updatedUser = await User.findByIdAndUpdate(userId,{$pull:{likedPosts:postId}},{new:true});
      // we gona insure that post also doesnt have user id so we can calculate total likes
      let postUpdate = await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}},{new:true});
      return res.status(200).json({
        message:"Post removed from liked Post List",
        Total_Liked_Posts:updatedUser?.likedPosts.length,
        Liked_posts : updatedUser.likedPosts
      })
    }else{
      // so if user has liked the post first time so we gona add it to liked post
      let updatedUser = await User.findByIdAndUpdate(userId,{$push:{likedPosts:postId}},{new:true});
      let postUpdate = await Post.findByIdAndUpdate(postId,{$push:{likes:userId}},{new:true});
      return res.status(200).json({message:"Post Added to liked Post List",
      Total_Liked_Posts:updatedUser?.likedPosts.length,
     Liked_posts:updatedUser?.likedPosts
    })
    }
  }catch(err){
    return res.status(500).json({message:`Internal server eroor ${err.message}`})
  }
}




//ADmin route to get user 
userControllers.getUser=async(req,res)=>{
  try{
    let userId = req.params.id;
    if(!validateMongoId(userId)){
      return res.status(400).json({message:"Invalid ID"})
    }
    let user = await User.findById(userId)
    if(!user){
      return res.status(404).json({messsage:"No user was found with given id"})
    }
    return res.status(200).json(user)
  }catch(err){
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// Admin route to get user list 
userControllers.getUser=async(req,res)=>{
  try{
    let userList = await User.find({})
    if(!userList){
      return res.status(404).json({messsage:"No user was found"})
    }
    return res.status(200).json(userList)
  }catch(err){
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// ADmin route to block user
userControllers.getUser=async(req,res)=>{
  try{
    let userToBlockId = req.params.id;
    if(!validateMongoId(userToBlockId)){
      return res.status(400).json({message:"Invalid ID"})
    }
    let user = await User.findByIdAndUpdate(userToBlockId,{isBlocked:true},{new:true})
    if(!user){
      return res.status(404).json({messsage:"No user was found with given id"})
    }
    return res.status(200).json({message:"USer was blocked",username:user.username})
  }catch(err){
    res.status(500).json({ message: 'Internal server error.' });
  }
}


module.exports = userControllers;
