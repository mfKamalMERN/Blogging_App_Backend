const express = require('express')
const { SignUp, Login, FollowUnfollow, Logout, MyProfile, UploadProfilePic, UpdatePassword, UpdateName, getUserDp, getOwnerName, getCommentererName, GetUsers, GetFollowers, CheckFollowingStatus, GetFollowings, Find_New_People, DeleteMyAccount, GetUserBlogs, GetBlogLikesUsers } = require('../Controllers/userControllers.js')
const { signUpValidation, loginValidation, updatePasswordValidation, updateNameValidation } = require('../Validations/userValidations.js')
const VerifyToken = require('../VerifyToken/VerifyToken.js')
const { upload } = require('../Multer/Multer.js')

const userRouter = express.Router()



userRouter.get('/', (req, res) => res.json('Hello !'))

userRouter.post('/signup', signUpValidation, SignUp)

userRouter.post('/login', loginValidation, Login)

userRouter.get('/logout', VerifyToken, Logout)

userRouter.put('/followunfollow/:userid', VerifyToken, FollowUnfollow)

userRouter.get('/myprofile', VerifyToken, MyProfile)

userRouter.put('/uploadprofilepic', VerifyToken, upload.single('file'), UploadProfilePic)

userRouter.patch('/updatepassword', VerifyToken, updatePasswordValidation, UpdatePassword)

userRouter.patch('/updatename', VerifyToken, updateNameValidation, UpdateName)

userRouter.get('/getuserdp/:userid', VerifyToken, getUserDp)

userRouter.get('/getusername/:userid', VerifyToken, getOwnerName)

userRouter.get('/getcommentername/:userid', VerifyToken, getCommentererName)

userRouter.get('/getallusers', VerifyToken, GetUsers)

userRouter.get('/getfollowers/:userid', VerifyToken, GetFollowers)

userRouter.get('/getfollowings/:userid', VerifyToken, GetFollowings)

userRouter.get('/checkfollowingstatus/:userid', VerifyToken, CheckFollowingStatus)

userRouter.get('/likesusers/:blogid', VerifyToken, GetBlogLikesUsers)

userRouter.get('/findnewpeople', VerifyToken, Find_New_People)

userRouter.delete('/deleteaccount', VerifyToken, DeleteMyAccount)

userRouter.get('/getuserblogs/:userid', VerifyToken, GetUserBlogs)


exports.userRouter = userRouter
