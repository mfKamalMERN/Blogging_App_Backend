const express = require('express')
const { SignUp, Login, FollowUnfollow, Logout, MyProfile, UploadProfilePic, UpdatePassword } = require('../Controllers/userControllers.js')
const { signUpValidation, loginValidation, updatePasswordValidation } = require('../Validations/userValidations.js')
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



exports.userRouter = userRouter
