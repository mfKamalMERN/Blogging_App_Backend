const express = require('express')
const { SignUp, Login, FollowUnfollow, Logout, MyProfile, UploadProfilePic, UpdatePassword, UpdateName, getUserDp, getOwnerName, getCommentererName, GetUsers, GetFollowers, CheckFollowingStatus, GetFollowings, Find_New_People, DeleteMyAccount, GetUserBlogs, GetBlogLikesUsers, GetUser, PrivatePublic, RemoveDP, UpdateContact, DeleteContact, ShowHideContact, ShowHideContactDetails, GetRequests } = require('../Controllers/userControllers.js')
const { signUpValidation, loginValidation, updatePasswordValidation, updateNameValidation, validIndianPhoneNumber } = require('../Validations/userValidations.js')
const VerifyToken = require('../VerifyToken/VerifyToken.js')
const { upload } = require('../Multer/Multer.js')

const userRouter = express.Router()



userRouter.get('/', (req, res) => res.json('Hello !'))

userRouter.post('/signup', signUpValidation, SignUp)

userRouter.post('/login', loginValidation, Login)

userRouter.get('/logout', Logout)

userRouter.put('/followunfollow/:userid/:loggeduserid', FollowUnfollow)

userRouter.get('/myprofile/:loggeduserid', MyProfile)

userRouter.put('/uploadprofilepic/:loggeduserid', upload.single('file'), UploadProfilePic)

userRouter.patch('/updatepassword/:loggeduserid', updatePasswordValidation, UpdatePassword)

userRouter.patch('/updatename/:loggeduserid', updateNameValidation, UpdateName)

userRouter.get('/getuserdp/:userid', getUserDp)

userRouter.get('/getusername/:userid', getOwnerName)

userRouter.get('/getcommentername/:userid', getCommentererName)

userRouter.get('/getallusers', GetUsers)

userRouter.get('/getfollowers/:userid', GetFollowers)

userRouter.get('/getfollowings/:userid', GetFollowings)

userRouter.get('/checkfollowingstatus/:userid/:loggeduserid', CheckFollowingStatus)

userRouter.get('/likesusers/:blogid', GetBlogLikesUsers)

userRouter.get('/findnewpeople', Find_New_People)

userRouter.delete('/deleteaccount/:loggeduserid', DeleteMyAccount)

userRouter.get('/getuserblogs/:userid/:loggeduserid', GetUserBlogs)

userRouter.get('/getuser/:userid', GetUser)

userRouter.patch('/privatepublic/:loggeduserid', PrivatePublic)

userRouter.patch('/removedp/:loggeduserid', RemoveDP)

userRouter.patch('/updatecontact', validIndianPhoneNumber, UpdateContact)

userRouter.patch('/deletecontact/:loggeduserid', DeleteContact)

userRouter.patch('/showhidecontact', ShowHideContact)

userRouter.patch('/showhidecontactdetails', ShowHideContactDetails)

userRouter.get('/getrequests/:loggeduserid', GetRequests)


exports.userRouter = userRouter
