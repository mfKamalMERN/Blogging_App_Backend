const { body } = require('express-validator')

exports.signUpValidation = [body('email').isEmail().withMessage(`Invalid Email`).normalizeEmail(), body('password').isLength({ min: 8, max: 15 }).withMessage("Pwd must be between 8 to 15 characters")]

exports.loginValidation = [body('email').isEmail().withMessage("Invalid Email").normalizeEmail(), body('password').isLength({ min: 8, max: 15 }).withMessage("Pwd must be between 8 to 15 characters")]

exports.updatePasswordValidation = [body('newpassword').isLength({ min: 8, max: 15 }).withMessage(`Pwd must be between 8 to 15 characters`)]

exports.updateNameValidation = [body('newName').isLength({ min: 4, max: 25 }).withMessage(`Name must be atleast 3 characters long`)]
