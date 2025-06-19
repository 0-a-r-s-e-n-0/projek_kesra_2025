const { deleteUploadedFile } = require('../helpers/fileHelper');

const respondError = (res, code, message, errorCode) => {
    deleteUploadedFile();
    return res.status(code).json({
        status: 'error',
        statusCode: code,
        message,
        errorCode
    });
};

module.exports = { respondError };
