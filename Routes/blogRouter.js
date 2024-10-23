const express = require("express")
const VerifyToken = require("../VerifyToken/VerifyToken")
const { CreateBlog, LikeUnlikeBlog, AddComment, DeleteComment, EditComment, EditBlogText, getAllBlogs, DeleteBlog, GetBlog, UploadBlogPic, CreateBlogWithFile, RemoveBlogPic, getAllBlogs2 } = require("../Controllers/blogControllers.js")
const { blogTextValidation, updateBlogTextValidation } = require("../Validations/blogValidations.js")
const { upload } = require("../Multer/Multer.js")

const blogRouter = express.Router()

blogRouter.get('/getallblogs/:loggeduserid', getAllBlogs)

blogRouter.get('/getallblogs2/:userid', getAllBlogs2)

blogRouter.put('/createblog/:loggeduserid', upload.single('file'), blogTextValidation, CreateBlog)

// blogRouter.put('/createblogwithfile', VerifyToken, upload.single('file'), blogTextValidation, CreateBlogWithFile)

blogRouter.patch('/likeunlikeblog/:blogid', LikeUnlikeBlog)

blogRouter.post('/addcomment/:blogid/:loggeduserid', AddComment)

blogRouter.patch('/deletecomment/:blogid/:commentid', DeleteComment)

blogRouter.patch('/editcomment/:blogid/:commentid', EditComment)

blogRouter.patch('/editblogtext/:blogid', updateBlogTextValidation, EditBlogText)

blogRouter.delete('/deleteblog/:blogid', DeleteBlog)

blogRouter.get('/getblog/:blogid', GetBlog)

blogRouter.put('/uploadblogpicture/:blogid/:loggeduserid', upload.single('file'), UploadBlogPic)

blogRouter.patch('/removeblogpic/:blogid', RemoveBlogPic)

module.exports = blogRouter