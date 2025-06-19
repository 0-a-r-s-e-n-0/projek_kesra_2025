const { respondError } = require('../../../helpers/validationHelper');

module.exports = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return respondError(res, 400, 'Email and password are required', 'MISSING_CREDENTIALS');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return respondError(res, 400, 'Invalid email format', 'INVALID_EMAIL');
    }

    if (password.length < 6) {
        return respondError(res, 400, 'Password must be at least 6 characters', 'PASSWORD_TOO_SHORT');
    }

    next();
};