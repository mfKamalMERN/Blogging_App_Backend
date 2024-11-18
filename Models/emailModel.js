const { default: mongoose } = require("mongoose");



const emailSchema = new mongoose.Schema({
    SentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },

    SentTo: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },

    CC: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: false },

    MailBody: { type: String, required: false },

    Subject: { type: String, required: false },

    Attachments: [{ type: String, required: false }]
})


exports.emailModel = mongoose.model("email", emailSchema);