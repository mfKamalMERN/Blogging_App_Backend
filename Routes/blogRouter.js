const express = require("express")
const VerifyToken = require("../VerifyToken/VerifyToken")
const { CreateBlog } = require("../Controllers/blogControllers.js")

const blogRouter = express.Router()

blogRouter.post('/createblog', VerifyToken, CreateBlog)

module.exports = blogRouter