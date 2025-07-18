const fs = require('fs');
const path = require('path');

// const deleteUploadedFile = (file) => {
//     if (file && file.path && typeof file.path === 'string') {
//         fs.unlink(file.path, (err) => {
//             if (err) console.error('Failed to delete uploaded file:', err);
//         });
//     }
// };

//more safety, add check to the file
// Fungsi untuk hapus satu file
const deleteSingleFile = (file) => {
    if (!file || typeof file !== 'object' || !file.path) return;

    const filePath = path.resolve(file.path);
    fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
    });
};

const removeFileIfExists = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete ${filePath}:`, err);
        });
    }
};

// Fungsi untuk hapus banyak file dari req.files (hasil dari multer.fields)
const deleteUploadedFile = (files) => {
    if (!files || typeof files !== 'object') return;

    // Bisa berupa: { id_card_photo: [file], profile_photo: [file] }
    Object.values(files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
            fileArray.forEach(deleteSingleFile);
        } else {
            deleteSingleFile(fileArray); // fallback just in case
        }
    });
};

const getUploadedFilePath = (file) => {
    if (!file || !file.filename || !file.fieldname) return null;

    return path.join('uploads', file.fieldname, file.filename);
};

module.exports = {
    deleteSingleFile,
    deleteUploadedFile,
    getUploadedFilePath,
    removeFileIfExists
};
