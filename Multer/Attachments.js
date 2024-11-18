const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'Public/Attachments'),

    filename: (req, file, cb) => cb(null, file.originalname + Date.now())
})

const uploadAttachment = multer({ storage });

module.exports = uploadAttachment;