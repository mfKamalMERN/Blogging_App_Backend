const { body } = require('express-validator')

const signUpValidation = [body('email').isEmail().withMessage(`Invalid Email`).normalizeEmail(), body('password').isLength({ min: 8, max: 15 }).withMessage("Pwd must be between 8 to 15 characters")]

module.exports = signUpValidation
