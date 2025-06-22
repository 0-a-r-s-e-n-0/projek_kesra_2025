const { respondError } = require('../../../helpers/validationHelper');

module.exports = (req, res, next) => {
    const {
        username, email, password, confirm_password,
        nik, full_name, gender, address
    } = req.body;

    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!confirm_password) missingFields.push('confirm password');
    if (!nik) missingFields.push('nik');
    if (!full_name) missingFields.push('full name');
    if (!gender) missingFields.push('gender');
    if (!address) missingFields.push('address');
    if (!req.files?.id_card?.[0]) missingFields.push('id card');

    if (missingFields.length > 0)
        return respondError(res, 400, `${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required`, 'INVALID_INPUT');

    if (username.length < 3 || username.length > 50)
        return respondError(res, 400, 'Username must be between 3 and 50 characters', 'INVALID_USERNAME');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        return respondError(res, 400, 'Invalid email format', 'INVALID_EMAIL');

    if (password !== confirm_password)
        return respondError(res, 400, 'Password and confirm_password do not match', 'PASSWORD_MISMATCH');
    if (password.length < 6)
        return respondError(res, 400, 'Password must be at least 6 characters', 'PASSWORD_TOO_SHORT');

    const nikRegex = /^\d{16,35}$/;
    if (!nikRegex.test(nik))
        return respondError(res, 400, 'NIK must be between 16 and 35 digits and contain only numbers', 'INVALID_NIK');

    if (full_name.trim().length < 3)
        return respondError(res, 400, 'Full name must be at least 3 characters', 'INVALID_FULL_NAME');

    const validGenders = ['Pria', 'Wanita'];
    if (!validGenders.includes(gender))
        return respondError(res, 400, 'Gender must be either "Pria" or "Wanita"', 'INVALID_GENDER');

    if (address.trim().length < 5)
        return respondError(res, 400, 'Address must be at least 5 characters', 'ADDRESS_TOO_SHORT');

    next();
};
