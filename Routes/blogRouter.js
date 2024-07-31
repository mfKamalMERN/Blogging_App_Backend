const express = require("express")
const VerifyToken = require("../VerifyToken/VerifyToken")
const { CreateBlog, LikeUnlikeBlog, AddComment } = require("../Controllers/blogControllers.js")

const blogRouter = express.Router()

blogRouter.post('/createblog', VerifyToken, CreateBlog)

blogRouter.patch('/likeunlikeblog/:blogid', VerifyToken, LikeUnlikeBlog)

blogRouter.post('/addcomment/:blogid', VerifyToken, AddComment)

module.exports = blogRouter