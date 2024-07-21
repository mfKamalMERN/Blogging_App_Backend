const mongoose = require('mongoose')
const userModel = require('../Models/usermodel.js')

const ConnectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://mfk:test123@portfolio.lsuj3bc.mongodb.net/Blogging_App?retryWrites=true&w=majority&appName=Portfolio`)

        const users = await userModel.find()

        console.log(`DB Connected`)
        
        console.log(users[1].Name)

    } catch (error) {
        console.log(error);
    }

}

module.exports = ConnectDB