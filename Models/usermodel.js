const mongoose = require('mongoose')

const userschema = new mongoose.Schema({

    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Contact: { type: Number, required: false },
    Password: { type: String, required: true },
    DP: { type: String, required: false },
    Blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "blogModel" }],
    Followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "userModel" }],
    Followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "userModel" }],
    isPrivateAccount: { type: Boolean, required: false },
    showContact: { type: Boolean , required: false },
})

const userModel = mongoose.model('user', userschema)

module.exports = userModel