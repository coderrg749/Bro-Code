const Joi = require('joi');

const postSchema ={};
const customHashtagValidator = Joi.string().regex(/^#[\w\d]+$/i).message('"{#value}" is not a valid hashtag. Hashtags should start with "#" and only contain letters and numbers.');


postSchema.createPostSchema = Joi.object({
    description: Joi.string().required(),
    hashtags: Joi.array().items(customHashtagValidator).default([]),
  });


postSchema.updatePostSchema = Joi.object({
  description: Joi.string().required(),
  hashtags: Joi.array().items(customHashtagValidator).default([]),
});




module.exports = postSchema