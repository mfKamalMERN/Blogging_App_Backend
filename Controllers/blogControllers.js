const { validationResult } = require("express-validator")
const blogModel = require("../Models/blogmodel.js")
const userModel = require("../Models/usermodel.js")


exports.getAllBlogs = (req, res) => {
    const { loggeduserid } = req.params
    blogModel.find()
        .then(async (blogs) => {
            try {
                const luser = await userModel.findById({ _id: loggeduserid })

                const blogstodisplay = []

                const myblogs = await blogModel.find({ Owner: loggeduserid })

                for (let blog of blogs) {
                    if (!myblogs.includes(blog)) {

                        const blogowner = await userModel.findById({ _id: blog.Owner })
                        if (blogowner.isPrivateAccount) {

                            if (blogowner.Followers.includes(loggeduserid)) blogstodisplay.push(blog)

                        }
                        else blogstodisplay.push(blog)
                    }
                }

                if (!luser.isPrivateAccount) res.json({ AllBlogs: [...new Set(blogstodisplay)], Token: req.cookies.token, LoggedUser: luser })

                else res.json({ AllBlogs: [...new Set(blogstodisplay), ...myblogs], Token: req.cookies.token, LoggedUser: luser })

            } catch (error) {
                console.log(error);
            }
        })
        .catch(er => console.log(er))
}

exports.CreateBlog = (req, res) => {
    const { blogstring, title } = req.body
    const { loggeduserid } = req.params
    const file = req.file

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) res.json({ ValidationError: true, ActError: errorV.array() })

    else {
        if (!file) {

            blogModel.create({ Blog: blogstring, Owner: loggeduserid, Title: title })
                .then(async (createdBlog) => {

                    try {

                        const createdBlogOwner = await userModel.findById({ _id: createdBlog.Owner })

                        createdBlogOwner.Blogs.push(createdBlog._id)

                        await createdBlogOwner.save()

                        res.json(`Blog created without file`)

                    } catch (error) {
                        console.log(error);
                    }
                })
                .catch(er => console.log(er))
        }

        else {
            blogModel.create({ Blog: blogstring, Owner: loggeduserid, Title: title, Picture: `https://blogging-app-backend-dpk0.onrender.com/Images/${file.filename}` })
                .then(async (createdBlog) => {

                    try {

                        const createdBlogOwner = await userModel.findById({ _id: createdBlog.Owner })

                        createdBlogOwner.Blogs.push(createdBlog._id)

                        await createdBlogOwner.save()

                        res.json(`Blog created with file`)

                    } catch (error) {
                        console.log(error);
                    }
                })
                .catch(er => console.log(er))
        }
    }
}

exports.LikeUnlikeBlog = async (req, res) => {
    const { blogid, loggeduserid } = req.params

    try {
        const targetblog = await blogModel.findById({ _id: blogid })

        if (targetblog.Likes.includes(loggeduserid)) {

            const index = targetblog.Likes.indexOf(loggeduserid)
            targetblog.Likes.splice(index, 1)

            await targetblog.save()

            res.json({ Status: "Unliked", Likes: targetblog.Likes })

        }

        else {
            targetblog.Likes.push(loggeduserid)
            await targetblog.save()
            res.json({ Status: "Liked", Likes: targetblog.Likes })
        }


    } catch (error) {
        console.log(`Error:${error}`);
    }

}

exports.AddComment = async (req, res) => {
    const { blogid, loggeduserid } = req.params
    const comment = req.body.newComment

    try {

        const targetblog = await blogModel.findById({ _id: blogid })

        targetblog.Comments.push({ Comment: comment, CommentedBy: loggeduserid })

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
    const { blogid, loggeduserid } = req.params

    blogModel.findById({ _id: blogid })
        .then(async (targetblog) => {

            try {
                const blogowner = await userModel.findById({ _id: targetblog.Owner })

                const loggeduser = await userModel.findById({ _id: loggeduserid })

                if (blogowner.Email === loggeduser.Email) {

                    targetblog.Picture = `https://blogging-app-backend-dpk0.onrender.com/Images/${file.filename}`

                    await targetblog.save()

                    res.json({ Issue: false, Msg: "upload successful", url: targetblog.Picture })
                }

                else res.json({ Issue: true, Msg: 'Invalid request', luser: loggeduserid, owner: targetblog.Owner })
            }
            catch (error) {
                console.log(error)
            }
        })
        .catch(er => console.log(er))
}

exports.RemoveBlogPic = (req, res) => {
    const { blogid } = req.params;

    blogModel.findByIdAndUpdate({ _id: blogid }, { Picture: null })
        .then(res.json({ URL: null, Msg: `Pic Removed` }))
        .catch(er => console.log(er));
}

exports.getAllBlogs2 = async (req, res) => {
    const { userid } = req.params;
    const Allblogs = [];

    blogModel.find({})
        .then(async (blogs) => {
            for (let blog of blogs) {
                var me = await userModel.findById({ _id: userid });
                const blogowner = await userModel.findById({ _id: blog.Owner })

                if (blog.Owner == userid) Allblogs.push(blog)
                else {
                    try {
                        if (blogowner.isPrivateAccount) {
                            if (me.Followings.includes(blogowner._id)) Allblogs.push(blog);
                        }
                        else Allblogs.push(blog);


                    } catch (error) {
                        console.log(error);
                    }
                }
            }
            res.json({ AllBlogs: Allblogs, LoggedUser: me })

        })
        .catch(er => console.log(er))
}