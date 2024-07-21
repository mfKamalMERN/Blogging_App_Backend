const { validationResult } = require("express-validator");
const userModel = require("../Models/usermodel.js");
const jwt = require('jsonwebtoken')


exports.SignUp = async (req, res) => {

    const { name, email, password } = req.body

    const errorV = validationResult(req)

    if (!errorV.isEmpty()) {
        res.json({ Msg: "Validation Error", actError: errorV.array() })
    }

    else {
        try {
            const founduser = await userModel.findOne({ Email: email })

            if (founduser) {
                res.json(`User with ${email} is already registered.`)
            }

            else {

                try {
                    await userModel.create({ Name: name, Email: email, Password: password })

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
        res.json({ Msg: "Validation Error", actError: errorV.array() })
    }

    else {
        userModel.findOne({ Email: email })
            .then((user) => {
                if (user) {

                    if (user.Password === password) {

                        const token = jwt.sign({ _id: user._id }, "jwt-secret-key", { expiresIn: "1h" })

                        res.cookie('token', token)

                        res.json({ Msg: `Welcome ${user.Name}! `, Token: token })

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
    res.clearCookie('token').json(`${req.user.Name} Logged Out`)
}

