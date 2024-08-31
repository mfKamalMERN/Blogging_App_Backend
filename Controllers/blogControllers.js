const { validationResult } = require("express-validator")
const blogModel = require("../Models/blogmodel.js")
const userModel = require("../Models/usermodel.js")


exports.getAllBlogs = (req, res) => {
    blogModel.find()
        .then(async (blogs) => {
            try {
                const luser = await userModel.findById({ _id: req.user._id })

                res.json({ AllBlogs: blogs, Token: req.cookies.token, LoggedUser: luser })

            } catch (error) {
                console.log(error);
            }
        })
        .catch(er => console.log(er))
}

exports.CreateBlog = (req, res) => {

    const { blogstring, title } = req.body

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) res.json({ ValidationError: true, ActError: errorV.array() })

    else {
        blogModel.create({ Blog: blogstring, Owner: req.user._id, Title: title })
            .then(async (createdBlog) => {

                try {

                    const createdBlogOwner = await userModel.findById({ _id: createdBlog.Owner })

                    createdBlogOwner.Blogs.push(createdBlog._id)

                    await createdBlogOwner.save()

                    res.json(`Blog created`)

                } catch (error) {
                    console.log(error);
                }
            })
            .catch(er => console.log(er))

    }
}

exports.LikeUnlikeBlog = async (req, res) => {
    const { blogid } = req.params

    try {
        const targetblog = await blogModel.findById({ _id: blogid })

        if (targetblog.Likes.includes(req.user._id)) {

            const index = targetblog.Likes.indexOf(req.user._id)
            targetblog.Likes.splice(index, 1)

            await targetblog.save()

            res.json({ Status: "Unliked", Likes: targetblog.Likes })

        }

        else {
            targetblog.Likes.push(req.user._id)
            await targetblog.save()
            res.json({ Status: "Liked", Likes: targetblog.Likes })
        }


    } catch (error) {
        console.log(`Error:${error}`);
    }

}

exports.AddComment = async (req, res) => {
    const blogid = req.params.blogid
    const comment = req.body.newComment

    try {

        const targetblog = await blogModel.findById({ _id: blogid })

        targetblog.Comments.push({ Comment: comment, CommentedBy: req.user._id })

        await targetblog.save()

        res.json({ Comments: targetblog.Comments })

    } catch (error) {
        console.log(error);
    }

}

exports.DeleteComment = (req, res) => {
    const { blogid, commentid } = req.params

    blogModel.findById({ _id: blogid })
        .then(async (targetblog) => {

            const index = targetblog.Comments.findIndex((cmnt) => cmnt._id == commentid)

            if (index < 0) res.json(`Comment not found`)

            else {
                // const tcomment = targetblog.Comments.find((cmn) => cmn._id == commentid)
                targetblog.Comments.splice(index, 1)

                await targetblog.save()

                res.json({ Status: `Comment removed`, Index: index, Comments: targetblog.Comments })
            }
            // else res.json(`Invalid Request`)
        })
        .catch(er => {
            console.log(er)
            res.json(er)
        })

}

exports.EditComment = async (req, res) => {
    const { blogid, commentid } = req.params
    const newcomment = req.body.eComment

    try {

        const targetblog = await blogModel.findById({ _id: blogid })
        const targetcomment = targetblog.Comments.find((cmnt) => cmnt._id == commentid)

        // if (targetcomment.CommentedBy != luser) res.json(`Invalid Request`)
        // else {
        targetcomment.Comment = newcomment
        await targetblog.save()
        res.json({ Status: `Comment edited`, Comments: targetblog.Comments })
        // }
    } catch (error) {
        console.log(error);
    }

}

exports.EditBlogText = async (req, res) => {
    const blogid = req.params.blogid
    const newblog = req.body.blogContent
    const newtitle = req.body.title

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) res.json({ ValidationError: true, ActError: errorV.array() })
    else {

        try {
            const tblog = await blogModel.findById({ _id: blogid })

            tblog.Blog = newblog
            tblog.Title = newtitle

            await tblog.save()

            res.json({ Status: `Blog Updated`, NewBlog: tblog.Blog, NewTitle: newtitle })

        } catch (error) {
            console.log(error);
        }
    }
}

exports.DeleteBlog = (req, res) => {
    const { blogid } = req.params

    blogModel.findByIdAndDelete({ _id: blogid })
        .then(async deletedblog => {
            try {
                const targetuser = await userModel.findById({ _id: deletedblog.Owner })

                const index = targetuser?.Blogs?.findIndex((blog) => blog?._id == blogid)

                targetuser.Blogs.splice(index, 1)

                await targetuser.save()

                res.json(`blog deleted`)
            } catch (error) {
                console.log(error);

            }

        })
        .catch(er => console.log(er))
}

exports.GetBlog = async (req, res) => {
    const { blogid } = req.params

    try {
        const targetblog = await blogModel.findById({ _id: blogid })

        res.json(targetblog)

    } catch (error) {
        console.log(error);
    }
}

exports.UploadBlogPic = (req, res) => {
    const file = req.file
    const { blogid } = req.params

    blogModel.findById({ _id: blogid })
        .then(async (targetblog) => {

            try {
                const blogowner = await userModel.findById({ _id: targetblog.Owner })

                const loggeduser = await userModel.findById({ _id: req.user._id })

                if (blogowner.Email === loggeduser.Email) {

                    targetblog.Picture = `https://blogging-app-backend-dpk0.onrender.com/Images/${file.filename}`

                    await targetblog.save()

                    res.json({ Issue: false, Msg: "upload successful", url: targetblog.Picture })
                }

                else res.json({ Issue: true, Msg: 'Invalid request', luser: req.user._id, owner: targetblog.Owner })
            }
            catch (error) {
                console.log(error)
            }
        })
        .catch(er => console.log(er))
}