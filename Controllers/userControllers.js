const { validationResult } = require("express-validator");
const userModel = require("../Models/usermodel.js");
const jwt = require('jsonwebtoken');
const blogModel = require("../Models/blogmodel.js");
// const hashPassword = require("../HashPassword/hashPwd.js");
// const bcrypt = require('bcrypt'); // Import bcryptjs for password comparison


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
                    // const hashedPassword = await hashPassword(password);

                    await userModel.create({ Name: name, Email: email, Password: password, Contact: contact, DP: "https://preview.redd.it/simba-what-do-you-think-about-this-character-v0-7ffmfdfy56pb1.jpg?width=640&crop=smart&auto=webp&s=8ef7bacd9c3aaa19bc5192bf7ad89dcdcd1069b3" })

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
            .then(async (user) => {
                if (user) {
                    // const isMatch = await bcrypt.compare(password, user.Password);
                    const isMatch = user.Password === password;

                    if (isMatch) {

                        const token = jwt.sign({ _id: user._id }, "jwt-secret-key", { expiresIn: "1h" })

                        // res.cookie('token', token);

                        const { _id, Name, Email, Contact, DP, Blogs, Followers, Followings, isPrivateAccount } = user;
                        // const{Password, ...Others} = user;


                        res.json({ LoggedIn: true, Msg: `Welcome ${user.Name}! `, Token: token, LoggedUser: { _id, Name, Email, Contact, DP, Blogs, Followers, Followings, isPrivateAccount } })

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
    const { userid, loggeduserid } = req.params

    try {
        const targetuser = await userModel.findById({ _id: userid })
        const me = await userModel.findById({ _id: loggeduserid })

        if (userid == loggeduserid) res.json(`Invalid request`)

        else if (targetuser.Followers.includes(loggeduserid)) {
            const index = targetuser.Followers.indexOf(loggeduserid)

            targetuser.Followers.splice(index, 1)

            const index2 = me.Followings.indexOf(targetuser._id)
            me.Followings.splice(index2, 1)

            await targetuser.save()

            await me.save()

            res.json(`Unfollowed ${targetuser.Name}`)

        }

        else {
            if (!targetuser.isPrivateAccount) {

                targetuser.Followers.push(loggeduserid)

                me.Followings.push(targetuser._id)

                await targetuser.save()

                await me.save()

                return res.json(`Followed user ${targetuser.Name}`)
            }

            if (targetuser.FollowRequests.includes(loggeduserid)) {
                const idx = targetuser.FollowRequests.findIndex((id) => id == loggeduserid);
                targetuser.FollowRequests.splice(idx, 1);
                await targetuser.save();
                return res.json(`Follow request Cancelled`);
            }

            targetuser.FollowRequests.push(loggeduserid);
            await targetuser.save();

            return res.json(`Follow request sent to ${targetuser.Name}`);
        }
    }
    catch (error) {
        console.log(error);
    }
}


exports.Logout = (req, res) => {
    res.clearCookie('token')
    res.json({ Msg: `Logged Out`, LoggedOut: true })
}

exports.MyProfile = (req, res) => {
    const { loggeduserid } = req.params

    userModel.findById({ _id: loggeduserid })
        .then(user => res.json({ Profile: user }))
        .catch(er => console.log(er))

}

exports.UploadProfilePic = async (req, res) => {
    const file = req.file
    const { loggeduserid } = req.params

    try {
        const loggeduser = await userModel.findById({ _id: loggeduserid })

        loggeduser.DP = `https://blogging-app-backend-dpk0.onrender.com/Images/${file.filename}`

        await loggeduser.save()

        res.json(`Profile Pic updated for ${loggeduser.Name}`)

    } catch (error) {
        console.log(error);
    }
}

exports.UpdatePassword = (req, res) => {
    const { newpassword } = req.body
    const { loggeduserid } = req.params

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) res.json({ ValidationError: true, ActError: errorV.array() })
    else {

        userModel.findById({ _id: loggeduserid })
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
    const { loggeduserid } = req.params
    const errorV = validationResult(req)

    if (!errorV.isEmpty()) res.json({ ValidationError: true, ActError: errorV.array() })

    else {
        userModel.findById({ _id: loggeduserid })
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
        if (user?.DP) res.json(user?.DP)
        else res.json("https://preview.redd.it/simba-what-do-you-think-about-this-character-v0-7ffmfdfy56pb1.jpg?width=640&crop=smart&auto=webp&s=8ef7bacd9c3aaa19bc5192bf7ad89dcdcd1069b3")

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

                    const { _id, Name, DP, Followers, isPrivateAccount, FollowRequests } = user

                    Followwers.push({ _id, Name, DP, Followers, isPrivateAccount, FollowRequests })

                } catch (error) {
                    console.log(error);
                }
            }
            res.json({ Followwers, Token: req.cookies.token })
        })
        .catch(er => console.log(er))
}

exports.CheckFollowingStatus = async (req, res) => {
    const { userid, loggeduserid } = req.params

    try {
        const user = await userModel.findById({ _id: userid })

        if (user.Followers.includes(loggeduserid)) res.json({ isFollowing: true })

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

            const likeduser = await userModel.findById(usrid);

            const { _id, Name, DP, Followers, isPrivateAccount, FollowRequests } = likeduser

            likedUsers.push({ _id, Name, DP, Followers, isPrivateAccount, FollowRequests })
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

            const { _id, Name, DP, Followers, FollowRequests, isPrivateAccount } = user
            OtherUsers.push({ _id, Name, DP, Followers, FollowRequests, isPrivateAccount })

        }

        res.json({ OtherUsers, Token: req.cookies.token })

    } catch (error) {
        console.log(error);
    }

}


exports.DeleteMyAccount = (req, res) => {
    const { loggeduserid } = req.params
    userModel.findByIdAndDelete({ _id: loggeduserid })
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
    const { userid, loggeduserid } = req.params
    const targetblogs = []

    userModel.findById({ _id: userid })
        .then(async targetuser => {

            if (targetuser.isPrivateAccount) {
                if (targetuser?.Followers?.includes(loggeduserid) || userid == loggeduserid) {

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
    const { loggeduserid } = req.params

    userModel.findById({ _id: loggeduserid })
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
                    user.isPrivateAccount = isPrivate;

                    if (user.FollowRequests.length) {
                        user.FollowRequests = [];
                    }
                    await user.save();

                    res.json(`Switched to public account`)
                }
            }
        })
        .catch(er => console.log(er))
}

exports.RemoveDP = (req, res) => {
    const { loggeduserid } = req.params;
    const { imgurl } = req.body;

    userModel.findById({ _id: loggeduserid })
        .then(usr => {
            usr.DP = imgurl;
            usr.save()
            res.json(`DP removed.`)
        })
        .catch(er => console.log(er))
}

exports.UpdateContact = async (req, res) => {
    const { loggeduserid, NrFormatContactValue, isDeleteContact } = req.body;

    if (!isDeleteContact) {
        if (!loggeduserid || !NrFormatContactValue) {
            return res.status(400).json({ message: "loggeduserid and NrFormatContactValue are required." });
        }

        try {
            const user = await userModel.findById(loggeduserid);

            if (!user) {
                return res.status(404).json({ message: "User  not found" });
            }

            if (user.Contact == NrFormatContactValue) {
                res.status(200).json({ message: `Already existing contact` })
                return;
            };

            user.Contact = NrFormatContactValue;
            await user.save();

            return res.json({ message: "Contact updated successfully", Contact: user.Contact });

        } catch (error) {
            console.error('Error updating contact:', error); // Log the error for debugging
            return res.status(500).json({
                error: 'Internal Server Error',
                message: 'An unexpected error occurred. Please try again later.'
            });
        }
    }

    else {
        if (!loggeduserid) {
            return res.status(400).json({ message: "loggeduserid is required." });
        }

        try {
            // Find the user by ID
            const user = await userModel.findById(loggeduserid);

            // Check if user exists
            if (!user) {
                return res.status(404).json({ message: "User  not found" });
            }

            // Check if contact exists
            if (!user.Contact) {
                return res.status(200).json({ message: "Contact is already deleted" });
            }

            // Delete the contact
            user.Contact = null;
            await user.save();

            return res.status(200).json({ message: "Contact deleted successfully", ContactDeleted: true });

        } catch (error) {
            console.error('Error deleting contact:', error); // Log the error for debugging
            return res.status(500).json({
                error: 'Internal Server Error',
                message: 'An unexpected error occurred. Please try again later.'
            });
        }
    }

};

exports.DeleteContact = async (req, res) => {
    const { loggeduserid } = req.params;

    // Validate input
    if (!loggeduserid) {
        return res.status(400).json({ message: "loggeduserid is required." });
    }

    try {
        // Find the user by ID
        const user = await userModel.findById(loggeduserid);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Check if contact exists
        if (!user.Contact) {
            return res.status(200).json({ message: "Contact is already deleted" });
        }

        // Delete the contact
        user.Contact = null;
        await user.save();

        return res.status(200).json({ message: "Contact deleted successfully", ContactDeleted: true });

    } catch (error) {
        console.error('Error deleting contact:', error); // Log the error for debugging
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
};

exports.ShowHideContact = async (req, res) => {
    const { loggeduserid, Showcontact } = req.body;

    if (!loggeduserid) {
        return res.status(400).json({ message: "loggeduserid is required." });
    }

    try {
        const user = await userModel.findById({ _id: loggeduserid })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.showContact == Showcontact) {
            return res.status(200).json({ message: "Contact already shown or hidden" });
        }

        user.showContact = Showcontact;
        await user.save();

        return res.status(200).json({
            message: "Contact visibility updated successfully", ContactVisibilityUpdated: true, ShowContact: user.showContact
        });

    } catch (error) {
        console.error(`Error while updating showhide contact`, error)
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    }

}

exports.ShowHideContactDetails = (req, res) => {
    const { loggeduserid, preference } = req.body;

    if (!loggeduserid) return res.status(400).json({ message: "loggeduserid is required." });

    userModel.findById(loggeduserid)
        .then(async (user) => {

            if (!user) return res.status(404).json({
                message: "User not found"
            });

            if (user.showContactDetails == preference) return res.status(200).json({
                message:
                    "Contact details already shown or hidden"
            });

            user.showContactDetails = preference;
            await user.save();

            res.status(200).json({ message: `Preferences updated`, ContactDetailsShownUpdated: true, Preference: user.showContactDetails });

        })
        .catch(err => {
            res.status(500).json({
                message: `Internal Server Error`,
                error: err
            })
        })
}

exports.GetRequests = async (req, res) => {
    const LoggedUserID = req.params.loggeduserid;
    let requestedUsers = [];

    if (!LoggedUserID) {
        return res.status(400).json({ message: "loggeduserid is required." });
    }

    try {
        const user = await userModel.findById(LoggedUserID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.FollowRequests.length) {
            return res.status(200).json({ message: "No requests found", Requests: false });
        }

        for (let userid of user.FollowRequests) {

            const user = await userModel.findById(userid);
            if (user) {
                const { _id, Name, DP } = user;
                requestedUsers.push({ _id, Name, DP });
            }
        }

        res.status(200).json({ message: "Requests found", Requests: requestedUsers });

    } catch (error) {
        console.error(`Error while getting requests`, error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    }

}

exports.RejectRequest = async (req, res) => {
    const { loggeduserid } = req.params;
    const { userid } = req.body;

    if (!loggeduserid) {
        return res.status(400).json({ message: "loggeduserid is required." });
    }

    try {
        const LoggedUser = await userModel.findById(loggeduserid);

        if (!LoggedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (LoggedUser.FollowRequests.includes(userid)) {
            const index = LoggedUser.FollowRequests.indexOf(userid);
            LoggedUser.FollowRequests.splice(index, 1);
            await LoggedUser.save();
            return res.status(200).json({ message: "Request rejected" });
        }

        res.status(200).json({ message: `No request found to reject` })

    } catch (error) {
        console.error(`Error while rejecting request`, error);
        res.status(500).json({
            message: `Internal Server Error`,
            Error: error.message
        })
    }
}

exports.AcceptRequest = async (req, res) => {
    const { loggeduserid } = req.params;
    const { userid } = req.body;

    // Validate input
    if (!loggeduserid || !userid) {
        return res.status(400).json({ message: "Both loggeduserid and userid are required." });
    }

    if (loggeduserid === userid) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
        const LoggedUser  = await userModel.findById(loggeduserid);
        if (!LoggedUser ) {
            return res.status(404).json({ message: "Logged user not found." });
        }

        const requestIndex = LoggedUser .FollowRequests.indexOf(userid);
        if (requestIndex === -1) {
            return res.status(400).json({ message: "No follow request found to accept." });
        }

        // Remove the follow request
        LoggedUser .FollowRequests.splice(requestIndex, 1);
        
        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User  to follow not found." });
        }

        // Update followings and followers
        user.Followings.push(loggeduserid);
        LoggedUser .Followers.push(userid);

        await Promise.all([user.save(), LoggedUser.save()]);

        return res.status(200).json({ message: "Request accepted." });
    } catch (error) {
        console.error(`Error while accepting request:`, error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}