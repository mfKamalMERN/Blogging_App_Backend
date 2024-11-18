const multer = require("multer");


const storagee = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'Public/Attachments'),

    filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
})

const uploadAttachment = multer({ storage: storagee });

module.exports = uploadAttachment;