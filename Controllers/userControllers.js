const { validationResult } = require("express-validator");
const userModel = require("../Models/usermodel.js");
const jwt = require('jsonwebtoken');
const blogModel = require("../Models/blogmodel.js");


exports.SignUp = async (req, res) => {

    const { name, email, password, contact } = req.body

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) {
        res.json({ ValidationError: true, actError: errorV.array() })
    }

    else {
        try {
            const founduser = await userModel.findOne({ Email: email })

            if (founduser) {
                res.json({ AlreadyRegistered: true, Msg: `User with ${email} is already registered.` })
            }

            else {

                try {
                    await userModel.create({ Name: name, Email: email, Password: password, Contact: contact })

                    res.json(`Hi ${name}! Welcome to blogging app, Please proceed to login!`)

                } catch (error) {
                    console.log(error);

                }

            }

        } catch (error) {
            console.log(error);
        }

    }

}


exports.Login = (req, res) => {

    const { email, password } = req.body

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) {
        res.json({ ValidationError: true, actError: errorV.array() })
    }

    else {
        userModel.findOne({ Email: email })
            .then((user) => {
                if (user) {

                    if (user.Password === password) {

                        const token = jwt.sign({ _id: user._id }, "jwt-secret-key", { expiresIn: "1h" })

                        res.cookie('token', token);

                        res.json({ LoggedIn: true, Msg: `Welcome ${user.Name}! `, Token: token, LoggedUser: user })

                    }
                    else res.json(`Incorrect Password`)
                }
                else {
                    res.json("No record found")
                }
            })
            .catch(er => console.log(er))
    }
}

exports.FollowUnfollow = async (req, res) => {
    const { userid } = req.params

    try {
        const targetuser = await userModel.findById({ _id: userid })
        const me = await userModel.findById({ _id: req.user._id })

        if (userid == req.user._id) res.json(`Invalid request`)

        else if (targetuser.Followers.includes(req.user._id)) {
            const index = targetuser.Followers.indexOf(req.user._id)

            targetuser.Followers.splice(index, 1)

            const index2 = me.Followings.indexOf(targetuser._id)
            me.Followings.splice(index2, 1)

            await targetuser.save()

            await me.save()

            res.json(`Unfollowed ${targetuser.Name}`)

        }

        else {
            targetuser.Followers.push(req.user._id)

            me.Followings.push(targetuser._id)

            await targetuser.save()

            await me.save()

            res.json(`Followed user ${targetuser.Name}`)
        }

    } catch (error) {
        console.log(error);
    }
}


exports.Logout = (req, res) => {
    res.clearCookie('token').json({ Msg: `${req.user.Name} Logged Out`, LoggedOut: true })
}

exports.MyProfile = (req, res) => {
    const luser = req.user._id

    userModel.findById({ _id: luser })
        .then(user => res.json({ Profile: user }))
        .catch(er => console.log(er))

}

exports.UploadProfilePic = async (req, res) => {
    const file = req.file

    try {
        const loggeduser = await userModel.findById({ _id: req.user._id })

        loggeduser.DP = `https://blogging-app-backend-dpk0.onrender.com/Images/${file.filename}`

        await loggeduser.save()

        res.json(`Profile Pic updated for ${loggeduser.Name}`)

    } catch (error) {
        console.log(error);
    }
}

exports.UpdatePassword = (req, res) => {
    const { newpassword } = req.body

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) res.json({ ValidationError: true, ActError: errorV.array() })
    else {

        userModel.findById({ _id: req.user._id })
            .then(async (loggeduser) => {
                if (loggeduser.Password === newpassword) res.json(`Please type a new password`)
                else {
                    loggeduser.Password = newpassword

                    await loggeduser.save()

                    res.json(`Password updated for ${loggeduser.Name}`)
                }
            })
            .catch(er => console.log(er))
    }

}

exports.UpdateName = (req, res) => {
    const newName = req.body.newName

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) res.json({ ValidationError: true, ActError: errorV.array() })

    else {
        userModel.findById({ _id: req.user._id })
            .then(async (user) => {
                if (user.Name === newName) res.json({ Msg: `${newName} is already existing`, UpdatedUser: user })
                else {
                    const oldName = user.Name
                    user.Name = newName
                    await user.save()
                    res.json({ Msg: `Name updated from ${oldName} to ${user.Name}`, UpdatedUser: user })
                }
            })
            .catch(er => console.log(er))

    }

}

exports.getUserDp = async (req, res) => {
    const { userid } = req.params

    try {
        const user = await userModel.findById({ _id: userid })
        res.json(user?.DP)

    } catch (error) {
        console.log(error);

    }
    // .then((user) => res.json(user.DP))
    // .catch(er => console.log(er))
}

exports.getOwnerName = (req, res) => {
    const { userid } = req.params

    userModel.findById({ _id: userid })
        .then((user) => res.json(user?.Name))
        .catch(er => console.log(er))
}

exports.getCommentererName = (req, res) => {
    const { userid } = req.params

    userModel.findById({ _id: userid })
        .then((user) => res.json(user?.Name))
        .catch(er => console.log(er))
}

exports.GetUsers = async (req, res) => {
    try {
        const users = await userModel.find({})

        const Users = []

        for (let user of users) {
            const { _id, Name, Followings, Followers, Blogs } = user

            Users.push({ _id, Name, Followings, Followers, Blogs })
        }

        res.json(Users)

    } catch (error) {
        console.log(error);
    }
}

exports.GetFollowers = (req, res) => {
    const { userid } = req.params
    const Followwers = []

    userModel.findById({ _id: userid })
        .then(async (targetuser) => {

            const followerids = targetuser.Followers

            for (let id of followerids) {
                try {

                    const user = await userModel.findById({ _id: id })

                    const { _id, Name, DP, Followers } = user

                    Followwers.push({ _id, Name, DP, Followers })

                } catch (error) {
                    console.log(error);
                }
            }
            res.json({ Followwers, Token: req.cookies.token })
        })
        .catch(er => console.log(er))
}

exports.CheckFollowingStatus = async (req, res) => {
    const { userid } = req.params

    try {
        const user = await userModel.findById({ _id: userid })

        if (user.Followers.includes(req.user._id)) res.json({ isFollowing: true })

        else res.json({ isFollowing: false })

    } catch (error) {
        console.log(error);
    }

}

exports.GetFollowings = (req, res) => {
    const { userid } = req.params
    const Followings = []

    userModel.findById({ _id: userid })
        .then(async (targetuser) => {

            const followingids = targetuser.Followings


            for (let id of followingids) {
                try {
                    const user = await userModel.findById({ _id: id })
                    const { _id, Name, DP, Followers } = user
                    Followings.push({ _id, Name, DP, Followers })

                } catch (error) {
                    console.log(error);

                }
            }
            res.json({ Followings, Token: req.cookies.token })

        })
        .catch(er => console.log(er))
}


exports.GetBlogLikesUsers = async (req, res) => {
    const { blogid } = req.params

    try {
        const targetblog = await blogModel.findById({ _id: blogid })

        const targetBlogLikes = targetblog.Likes

        const likedUsers = []

        for (let usrid of targetBlogLikes) {

            const likeduser = await userModel.findById({ _id: usrid })

            const { _id, Name, DP, Followers } = likeduser

            likedUsers.push({ _id, Name, DP, Followers })
        }

        res.json({ LikedUsers: likedUsers, Token: req.cookies.token })

    } catch (error) {
        console.log(error);
    }
}

exports.Find_New_People = async (req, res) => {

    try {
        const allusers = await userModel.find({})

        const OtherUsers = []

        for (let user of allusers) {

            const { _id, Name, DP, Followers } = user
            OtherUsers.push({ _id, Name, DP, Followers })

        }

        res.json({ OtherUsers, Token: req.cookies.token })

    } catch (error) {
        console.log(error);
    }

}


exports.DeleteMyAccount = (req, res) => {

    userModel.findByIdAndDelete({ _id: req.user._id })
        .then(async user => {

            const followingids = user.Followings

            for (let id of followingids) {
                try {
                    const usr = await userModel.findById({ _id: id })

                    const index = usr.Followers.indexOf(user._id)

                    usr.Followers.splice(index, 1)

                    await usr.save()

                } catch (error) {
                    console.log(error);

                }

            }

            await blogModel.findOneAndDelete({ Owner: user._id })

            res.clearCookie('token').json(`Account for ${user?.Name} is deleted`)
        })
        .catch(er => console.log(er))
}


exports.GetUserBlogs = (req, res) => {
    const { userid } = req.params
    const targetblogs = []

    userModel.findById({ _id: userid })
        .then(async targetuser => {

            if (targetuser.isPrivateAccount) {
                if (targetuser?.Followers?.includes(req.user._id) || userid == req.user._id) {

                    try {

                        for (let blogid of targetuser.Blogs) {

                            targetblogs.push(await blogModel.findById({ _id: blogid }))

                        }

                        res.json({ UserBlogs: targetblogs, Token: req.cookies.token })

                    } catch (error) {
                        console.log(error)
                    }
                }
                else res.json({ UserBlogs: targetblogs, Token: req.cookies.token })
            }

            else {
                try {

                    for (let blogid of targetuser.Blogs) {

                        targetblogs.push(await blogModel.findById({ _id: blogid }))

                    }

                    res.json({ UserBlogs: targetblogs, Token: req.cookies.token })

                } catch (error) {
                    console.log(error)
                }
            }
        })
        .catch(er => console.log(er))
}


exports.GetUser = (req, res) => {
    const { userid } = req.params

    userModel.findById({ _id: userid })
        .then(user => res.json({ User: user, Token: req.cookies.token }))
        .catch(er => console.log(er))
}

exports.PrivatePublic = (req, res) => {
    const { isPrivate } = req.body

    userModel.findById({ _id: req.user._id })
        .then(async user => {
            if (isPrivate) {
                if (user.isPrivateAccount === isPrivate) res.json(`Already a private account`)
                else {
                    user.isPrivateAccount = isPrivate
                    await user.save()
                    res.json(`switched to private account`)
                }
            }
            else {
                if (user.isPrivateAccount === isPrivate) res.json(`Already a public account`)
                else {
                    user.isPrivateAccount = isPrivate
                    await user.save()
                    res.json(`Switched to public account`)
                }
            }
        })
        .catch(er => console.log(er))
}