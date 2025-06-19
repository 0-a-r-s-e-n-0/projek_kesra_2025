const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Buat folder jika belum ada
const ensureDirectoryExistence = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Fungsi utama
const createUploader = ({ fields }) => {
    const allFieldNames = fields.map(f => f.fieldName);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const matchedField = fields.find(f => f.fieldName === file.fieldname);
            const uploadPath = path.resolve('uploads', matchedField.folderName);
            ensureDirectoryExistence(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const name = req.user?.username || 'guest'; // Optional: req.body.username
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const random = Math.floor(Math.random() * 1e6);
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}_${name}_${timestamp}_${random}${ext}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        const matchedField = fields.find(f => f.fieldName === file.fieldname);
        if (matchedField && matchedField.allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type for ${file.fieldname}`), false);
        }
    };

    const limits = {
        fileSize: Math.max(...fields.map(f => f.maxSizeMB)) * 1024 * 1024
    };

    return multer({
        storage,
        fileFilter,
        limits
    }).fields(fields.map(f => ({ name: f.fieldName, maxCount: 1 })));
};

module.exports = createUploader;
