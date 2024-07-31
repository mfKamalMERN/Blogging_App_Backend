const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, 'Public/Images')
    },

    filename: (req, file, cb) => cb(null, Date.now() + file.originalname)
})

exports.upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {

        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            return cb(null, true)
        }

        else {
            return cb(new Error("Wrong File Type, File must be png or jpg or jpef format"))
        }
    }
})
