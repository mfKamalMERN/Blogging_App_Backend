const { validationResult } = require("express-validator");
const userModel = require("../Models/usermodel.js");


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




