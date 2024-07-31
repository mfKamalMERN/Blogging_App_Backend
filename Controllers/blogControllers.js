const blogModel = require("../Models/blogmodel")

exports.CreateBlog = (req, res) => {

    const { blogstring } = req.body

    blogModel.create({ Blog: blogstring, Owner: req.user._id })
        .then(res.json(`Blog created`))
        .catch(er => console.log(er))

}