const express = require("express")
const VerifyToken = require("../VerifyToken/VerifyToken")
const { CreateBlog, LikeUnlikeBlog, AddComment, DeleteComment } = require("../Controllers/blogControllers.js")

const blogRouter = express.Router()

blogRouter.post('/createblog', VerifyToken, CreateBlog)

blogRouter.patch('/likeunlikeblog/:blogid', VerifyToken, LikeUnlikeBlog)

blogRouter.post('/addcomment/:blogid', VerifyToken, AddComment)

blogRouter.patch('/deletecomment/:blogid/:commentid', VerifyToken, DeleteComment)

module.exports = blogRouter