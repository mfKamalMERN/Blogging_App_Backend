const mongoose = require('mongoose')

const blogschema = new mongoose.Schema({
    Blog: { type: String, required: true },

    Title: { type: String, required: false },

    Owner: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },

    Likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userModel' }],

    Comments: [
        { Comment: { type: String, required: false }, CommentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' } }
    ],

})

const blogModel = mongoose.model('blog', blogschema)

module.exports = blogModel