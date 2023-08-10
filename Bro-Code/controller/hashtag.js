const Hashtag=require('../models/hashtags')
const Post=require('../models/post')

const hashtagControllers ={};

hashtagControllers.categorize =async(req,res)=>{
try{
const hashtagArray = req.body.searchHashtags;
const lowerCaseQuery = hashtagArray.map(ele => ele.toLowerCase())


}catch(err){

}



}











module.exports = hashtagControllers;