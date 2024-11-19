const { emailModel } = require("../Models/emailModel.js");
const userModel = require("../Models/usermodel.js");

exports.NewMail = async (req, res) => {
    const { loggeduserid } = req.params;
    const { SentTo, CC, Subject, MailBody } = req.body;
    const files = req.files;

    if (!loggeduserid || !SentTo) {
        return res.status(400).json({ message: "Invalid request by user" });
    }

    try {
        var ccUser = await userModel.findOne({ Name: CC })
        var sentToUser = await userModel.findOne({ Name: SentTo })
        const sentByUser = await userModel.findById(loggeduserid)

        if (!sentToUser || !sentByUser) return res.status(400).json({ message: "Invalid user" })

    } catch (error) {
        return res.status(500).json({ message: "Error in finding user" });
    }

    if (files && files.length > 0) {
        const filePaths = [];
        try {


            const createdMail = await emailModel.create({ SentTo: sentToUser?._id, SentBy: loggeduserid, CC: ccUser?._id, Subject, MailBody });

            for (let file of files) {
                filePaths.push(`https://blogging-app-backend-dpk0.onrender.com/Attachments/${file.filename}`)
            }
            const targetMail = emailModel.findById(createdMail._id);
            targetMail.Attachments = filePaths;
            await targetMail.save();

            return res.status(201).json({ message: "Mail sent successfully with files" });

        } catch (error) {
            return res.status(500).json({ message: "Error creating mail" });
        }
    }

    try {

        await emailModel.create({ SentTo: sentToUser._id, SentBy: loggeduserid, CC: ccUser?._id, Subject, MailBody });
        return res.status(201).json({ message: "Mail sent successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Error creating mail" });
    }

}

exports.GetReceivedMails = async (req, res) => {
    const { loggeduserid } = req.params

    if (!loggeduserid) {
        return res.status(400).json({ message: "Invalid user id" })
    }

    const receivedMails = [];

    try {
        const ReceivedMails = await emailModel.find({ SentTo: loggeduserid })
        for (let mail of ReceivedMails) {
            const sentByUser = await userModel.findById(mail.SentBy)
            const sentToUser = await userModel.findById(mail.SentTo)
            receivedMails.push({ _id: mail._id, SentBy: sentByUser.Name, Subject: mail.Subject, SentTo: sentToUser.Name })
        }
        return res.status(200).json(receivedMails);

    } catch (error) {
        return res.status(500).json({ message: "Error in finding received mails" });
    }

}


exports.GetSentMails = async (req, res) => {
    const { loggeduserid } = req.params;

    if (!loggeduserid) {
        return res.status(400).json({ message: "Invalid user id" })
    }

    const sentMails = [];

    try {
        const SentMails = await emailModel.find({ SentBy: loggeduserid })

        for (let mail of SentMails) {
            const sentByUser = await userModel.findById(mail.SentBy)
            const sentToUser = await userModel.findById(mail.SentTo)
            sentMails.push({ _id: mail._id, SentBy: sentByUser.Name, Subject: mail.Subject, SentTo: sentToUser.Name })
        }

        return res.status(200).json(sentMails);

    } catch (error) {
        return res.status(500).json({ message: "Error in finding received mails" });
    }

}

exports.GetMailDetails = async (req, res) => {
    // const { loggeduserid } = req.body;
    const { emailid, loggeduserid } = req.params;

    if (!loggeduserid) {
        return res.status(400).json({ message: "Invalid user id" });
    }

    if (!emailid) {
        return res.status(400).json({ message: "Invalid email id" });
    }

    try {
        const mail = await emailModel.findById(emailid);

        if (!mail) {
            return res.status(404).json({ message: "Email not found" });
        }

        const sentByUser = await userModel.findById(mail.SentBy);
        const receivedByUser = await userModel.findById(mail.SentTo);
        const ccUser = await userModel.findById(mail.CC);

        const mailDetails = { sentBy: sentByUser.Name, sentTo: receivedByUser.Name, Subject: mail.Subject, EmailBody: mail.MailBody, CC: ccUser?.Name, Attachments: mail.Attachments }

        return res.status(200).json(mailDetails);

    } catch (error) {
        return res.status(500).json({ message: "Error in finding mail details" });
    }


}