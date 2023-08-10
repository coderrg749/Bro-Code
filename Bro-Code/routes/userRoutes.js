const express = require('express')
const router = express.Router()
const userControllers = require('../controller/user')
const {upload} = require('../middleware/multer')
const {isAdmin ,authMiddleware}=require('../middleware/auth')

router.post('/register',userControllers.register)
router.post('/login',userControllers.login)
router.put('/avatar',authMiddleware,upload,userControllers.avatar)
router.put('/edit-profile',authMiddleware,userControllers.profile)
router.get('/follow-user/:id',authMiddleware,userControllers.follow)
router.get('/unfollow-user/:id',authMiddleware,userControllers.unfollowUser)
router.get('/user/:username',authMiddleware,userControllers.searchUser)

//Admin related 

router.get('/get-user',authMiddleware,isAdmin,userControllers.getUser)
router.put('/block-user',authMiddleware,isAdmin,userControllers.bockUser)



module.exports =router;