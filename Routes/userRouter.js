const express = require('express')
const { SignUp } = require('../Controllers/userControllers.js')
const signUpValidation = require('../Validations/userValidations.js')

const userRouter = express.Router()

userRouter.post('/signup', signUpValidation, SignUp)

exports.userRouter = userRouter
