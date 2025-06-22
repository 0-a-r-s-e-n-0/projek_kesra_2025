const { respondError } = require('../../../helpers/validationHelper');

module.exports = (req, res, next) => {
    const body = req.body || {};
    const files = req.files || {};

    const {
        username,
        email,
        nik,
        full_name,
        gender,
        address,
        birth_date,
        phone_number
    } = body;

    const {
        profile_photo,
        id_card_photo
    } = files;

    const hasAtLeastOneField = [
        username, email, nik, full_name, gender, address, birth_date, phone_number,
        profile_photo, id_card_photo
    ].some(field => field !== undefined && field !== null);

    if (!hasAtLeastOneField) {
        return respondError(res, 400, 'At least one field or file must be provided for update', 'EMPTY_UPDATE_DATA');
    }

    // Validasi opsional
    if (username !== undefined) {
        if (typeof username !== 'string' || username.length < 3 || username.length > 50) {
            return respondError(res, 400, 'Username must be between 3 and 50 characters', 'INVALID_USERNAME');
        }
    }

    if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return respondError(res, 400, 'Invalid email format', 'INVALID_EMAIL');
        }
    }

    if (nik !== undefined) {
        const nikRegex = /^\d{16,35}$/;
        if (!nikRegex.test(nik)) {
            return respondError(res, 400, 'NIK must be between 16 and 35 digits and contain only numbers', 'INVALID_NIK');
        }
    }

    if (full_name !== undefined) {
        if (typeof full_name !== 'string' || full_name.trim().length < 3) {
            return respondError(res, 400, 'Full name must be at least 3 characters', 'INVALID_FULL_NAME');
        }
    }

    if (gender !== undefined) {
        const validGenders = ['Pria', 'Wanita'];
        if (!validGenders.includes(gender)) {
            return respondError(res, 400, 'Gender must be either "Pria" or "Wanita"', 'INVALID_GENDER');
        }
    }

    if (address !== undefined) {
        if (typeof address !== 'string' || address.trim().length < 5) {
            return respondError(res, 400, 'Address must be at least 5 characters', 'ADDRESS_TOO_SHORT');
        }
    }

    next();
};
