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
        console.log(error);
    }

}