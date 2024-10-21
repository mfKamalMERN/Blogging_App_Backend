const express = require("express")
const VerifyToken = require("../VerifyToken/VerifyToken")
const { CreateBlog, LikeUnlikeBlog, AddComment, DeleteComment, EditComment, EditBlogText, getAllBlogs, DeleteBlog, GetBlog, UploadBlogPic, CreateBlogWithFile, RemoveBlogPic } = require("../Controllers/blogControllers.js")
const { blogTextValidation, updateBlogTextValidation } = require("../Validations/blogValidations.js")
const { upload } = require("../Multer/Multer.js")

const blogRouter = express.Router()

blogRouter.get('/getallblogs', getAllBlogs)

blogRouter.put('/createblog', VerifyToken, upload.single('file'), blogTextValidation, CreateBlog)

// blogRouter.put('/createblogwithfile', VerifyToken, upload.single('file'), blogTextValidation, CreateBlogWithFile)

blogRouter.patch('/likeunlikeblog/:blogid', VerifyToken, LikeUnlikeBlog)

blogRouter.post('/addcomment/:blogid', VerifyToken, AddComment)

blogRouter.patch('/deletecomment/:blogid/:commentid', VerifyToken, DeleteComment)

blogRouter.patch('/editcomment/:blogid/:commentid', VerifyToken, EditComment)

blogRouter.patch('/editblogtext/:blogid', VerifyToken, updateBlogTextValidation, EditBlogText)

blogRouter.delete('/deleteblog/:blogid', VerifyToken, DeleteBlog)

blogRouter.get('/getblog/:blogid', VerifyToken, GetBlog)

blogRouter.put('/uploadblogpicture/:blogid', VerifyToken, upload.single('file'), UploadBlogPic)

blogRouter.patch('/removeblogpic/:blogid', VerifyToken, RemoveBlogPic)

module.exports = blogRouter