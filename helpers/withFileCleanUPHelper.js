const fs = require('fs');
const path = require('path');

const withFileCleanup = (validatorFn) => {
    return (req, res, next) => {
        validatorFn(req, {
            ...res,
            status: (code) => {
                return {
                    json: (data) => {
                        // 🔥 Bersihkan semua file yang diupload jika validasi gagal
                        if (req.files && typeof req.files === 'object') {
                            for (const field in req.files) {
                                req.files[field].forEach((fileObj) => {
                                    if (fileObj.path) {
                                        const filePath = path.resolve(fileObj.path);
                                        fs.unlink(filePath, (err) => {
                                            if (err) {
                                                console.error(`❌ Failed to delete uploaded file ${filePath}:`, err);
                                            } else {
                                                console.log(`🗑️ Deleted uploaded file: ${filePath}`);
                                            }
                                        });
                                    }
                                });
                            }
                        }

                        return res.status(code).json(data);
                    }
                };
            }
        }, next);
    };
};

module.exports = withFileCleanup;
