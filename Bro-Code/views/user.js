const Joi = require('joi')
const userSchema ={};

userSchema.registrationSchema = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(), //pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).
  });


  userSchema.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });



userSchema.profileSchema = Joi.object({
  username: Joi.string().min(3).max(15).optional(),
  description: Joi.string().max(100).allow('').optional(),
  gender: Joi.string().valid('male', 'female').optional(),
});



module.exports=userSchema;