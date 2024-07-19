const mongoose = require('mongoose')

const ConnectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://mfk:test123@portfolio.lsuj3bc.mongodb.net/Blogging_App?retryWrites=true&w=majority&appName=Portfolio`)

        console.log(`DB Connected`)

    } catch (error) {
        console.log(error);
    }

}

module.exports = ConnectDB