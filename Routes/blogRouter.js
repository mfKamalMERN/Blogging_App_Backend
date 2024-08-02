const express = require("express")
const VerifyToken = require("../VerifyToken/VerifyToken")
const { CreateBlog, LikeUnlikeBlog, AddComment, DeleteComment, EditComment, EditBlogText, getAllBlogs } = require("../Controllers/blogControllers.js")
const { blogTextValidation, updateBlogTextValidation } = require("../Validations/blogValidations.js")

const blogRouter = express.Router()

blogRouter.get('/getallblogs', VerifyToken, getAllBlogs)

blogRouter.post('/createblog', VerifyToken, blogTextValidation, CreateBlog)

blogRouter.patch('/likeunlikeblog/:blogid', VerifyToken, LikeUnlikeBlog)

blogRouter.post('/addcomment/:blogid', VerifyToken, AddComment)

blogRouter.patch('/deletecomment/:blogid/:commentid', VerifyToken, DeleteComment)

blogRouter.patch('/editcomment/:blogid/:commentid', VerifyToken, EditComment)

blogRouter.patch('/editblogtext/:blogid', VerifyToken, updateBlogTextValidation, EditBlogText)

module.exports = blogRouter