const { body } = require('express-validator')

exports.blogTextValidation = [body('blogstring').isLength({ min: 5 }).withMessage(`blog must be atleast 5 characters`), body('title').isLength({ min: 5 }).withMessage('Title must be 5 characters long')]

exports.updateBlogTextValidation = [body('blogContent').isLength({ min: 5 }).withMessage(`blog must be atleast 5 characters`), body('title').isLength({ min: 5 }).withMessage('Title must be 5 characters long')]