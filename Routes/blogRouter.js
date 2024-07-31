const express = require("express")
const VerifyToken = require("../VerifyToken/VerifyToken")
const { CreateBlog, LikeUnlikeBlog } = require("../Controllers/blogControllers.js")

const blogRouter = express.Router()

blogRouter.post('/createblog', VerifyToken, CreateBlog)

blogRouter.patch('/likeunlikeblog/:blogid', VerifyToken, LikeUnlikeBlog)

module.exports = blogRouter