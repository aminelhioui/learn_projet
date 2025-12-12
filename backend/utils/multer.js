const fs = require('fs');
const multer = require('multer');
const path = require('path');


// stockage
const uploadPath = path.join(__dirname, '..', 'uploads');

// upload directory
fs.mkdirSync(uploadPath, { recursive: true });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,unique + ext);
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
}
module.exports = multer({ storage, fileFilter });

