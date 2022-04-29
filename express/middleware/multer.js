const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, callback) {
        if (req.body.postId) {
            callback(null, `public/images/uploads/posts`)
        }

        // TODO: add non-post image uploads  (image middleware end-point here)
    },
    filename(req, file, callback) {
        callback(null, `post_id-${req.body.postId};${file.originalname}`)
    }
})

const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']

const fileFilter = (req, file, callback) => {
    if (types.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

module.exports = multer({storage, fileFilter})