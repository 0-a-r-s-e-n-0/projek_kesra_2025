const sendSuccess = (res, code, message, data) =>
    res.status(code).json({ status: 'success', statusCode: code, message, data });

const sendError = (res, code, message, errorCode) =>
    res.status(code).json({ status: 'error', statusCode: code, message, errorCode });

module.exports = { sendSuccess, sendError };
