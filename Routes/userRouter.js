const express = require('express')
const { SignUp, Login, FollowUnfollow, Logout, MyProfile } = require('../Controllers/userControllers.js')
const { signUpValidation, loginValidation } = require('../Validations/userValidations.js')
const VerifyToken = require('../VerifyToken/VerifyToken.js')

const userRouter = express.Router()

userRouter.get('/', (req, res) => res.json('Hello !'))

userRouter.post('/signup', signUpValidation, SignUp)

userRouter.post('/login', loginValidation, Login)

userRouter.get('/logout', VerifyToken, Logout)

userRouter.put('/followunfollow/:userid', VerifyToken, FollowUnfollow)

userRouter.get('/myprofile', VerifyToken, MyProfile)

exports.userRouter = userRouter
