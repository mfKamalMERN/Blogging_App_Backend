const jwt = require('jsonwebtoken')
const userModel = require('../Models/usermodel.js')


const VerifyToken = (req, res, next) => {

    const token = req.cookies.token

    if (!token) {
        res.json(`Missing token`)
    }

    else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) res.json(err)

            else {
                userModel.findById({ _id: decoded._id })
                    .then(user => {
                        req.user = user
                        next()
                    })
                    .catch(er => console.log(er))
            }
        })
    }


}

module.exports = VerifyToken