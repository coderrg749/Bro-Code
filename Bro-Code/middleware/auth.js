const User = require('../models/user')
const { verifyToken } = require('../utils/jwtToken')

const authMiddleware = async(req, res, next) => {
    let token;
    if (
        req.headers['authorization'] &&
        req.headers['authorization'].startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
        try {
            if (token) {
                const decodedToken = await verifyToken(token)
                const user = await User.findById(decodedToken?.id)
                req.user = user
                next()
            }
        } catch (error) {
            res.status(401)
            throw new Error('Login again')
        }
    } else {
        throw new Error('No token inside header')
    }
}

const isAdmin = async(req, res, next) => {
    const { email } = req.user
    const adminUser = await User.findOne({ email })
    if (adminUser.role !== 'admin') {
        throw new Error('Not admin')
    } else {
        next()
    }
}

module.exports = {
    authMiddleware,
    isAdmin}