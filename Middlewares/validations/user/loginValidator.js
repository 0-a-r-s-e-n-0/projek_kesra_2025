const { respondError } = require('../../../helpers/validationHelper');

module.exports = (req, res, next) => {
    const {
        email, password
    } = req.body;

    // Cek field wajib
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
        return respondError(res, 400, `${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required`, 'INVALID_INPUT');
    }

    // Format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return respondError(res, 400, 'Invalid email format', 'INVALID_EMAIL');
    }

    // Password minimum
    if (password.length < 6) {
        return respondError(res, 400, 'Password must be at least 6 characters', 'PASSWORD_TOO_SHORT');
    }

    next();
};
