const blogModel = require("../Models/blogmodel")

exports.CreateBlog = (req, res) => {

    const { blogstring } = req.body

    blogModel.create({ Blog: blogstring, Owner: req.user._id })
        .then(res.json(`Blog created`))
        .catch(er => console.log(er))

}

exports.LikeUnlikeBlog = async (req, res) => {
    const { blogid } = req.params

    try {
        const targetblog = await blogModel.findById({ _id: blogid })

        if (targetblog.Likes.includes(req.user._id)) {

            const index = targetblog.Likes.indexOf(req.user._id)
            targetblog.Likes.splice(index, 1)

            await targetblog.save()

            res.json("Unliked")

        }

        else {
            targetblog.Likes.push(req.user._id)
            await targetblog.save()
            res.json("Liked")
        }


    } catch (error) {
        console.log(`Error:${error}`);
    }

}

exports.AddComment = async (req, res) => {
    const blogid = req.params.blogid
    const { comment } = req.body

    try {

        const targetblog = await blogModel.findById({ _id: blogid })
        targetblog.Comments.push({ Comment: comment, CommentedBy: req.user._id })

        await targetblog.save()
        const a = 10


        const pr = new Promise((res, rej) => {
            if (a >= 6) res("Comment Added")

            else rej("Error: Can't add comment")

        })

        pr.then((result) => {
            res.json({ result, Comment: targetblog.Comments.find((cmnt) => cmnt.Comment === comment) })
        }).catch(er => res.json(er))

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

                res.json({ Status: `Comment removed`, Index: index })
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
    const newcomment = req.body.newcomment
    
    try {

        const targetblog = await blogModel.findById({ _id: blogid })
        const targetcomment = targetblog.Comments.find((cmnt) => cmnt._id == commentid)

        // if (targetcomment.CommentedBy != luser) res.json(`Invalid Request`)
        // else {
            targetcomment.Comment = newcomment
            await targetblog.save()
            res.json({ Status: `Comment edited`, UpdatedComment: targetcomment.Comment })
        // }
    } catch (error) {
        console.log(error);
    }

}