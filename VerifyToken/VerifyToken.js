const jwt = require('jsonwebtoken')
const userModel = require('../Models/usermodel.js')


const VerifyToken = (req, res, next) => {

    const token = req.cookies.token

    if (!token) res.json(`Missing token`)

    else {
        jwt.verify(token, "jwt-secret-key", async (err, decoded) => {

            if (err) res.json(err)

            else {
                try {
                    req.user = await userModel.findById({ _id: decoded._id })

                    next()
                } catch (error) {
                    console.log(error)
                }
            }
            // else {
            //     userModel.findById({ _id: decoded._id })
            //         .then((usr) => {
            //             req.user = usr;
            //             next();
            //         })
            //         .catch(er => console.log(er))
            // }
        })
    }


}

module.exports = VerifyToken