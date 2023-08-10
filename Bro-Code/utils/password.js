const bcrypt = require('bcrypt')


function generateHash(password){
    const salts = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password,salts)
}
function compareHash(password,hash){
    return bcrypt.compareSync(password,hash)
}
module.exports = {
    generateHash,
    compareHash
}