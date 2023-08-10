const jwt = require('jsonwebtoken')

const generateToken = (id,email)=>{
    return jwt.sign({id:id,email:email},process.env.SECRET_KEY,{expiresIn:'1h'})
}
const verifyToken = (token)=>{
    return jwt.verify(token,process.env.SECRET_KEY);
 }


 module.exports={
    generateToken,
    verifyToken
 }