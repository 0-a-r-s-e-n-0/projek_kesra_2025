const validateUserInputForRegistration = (req, res, next) => {
    const {
        username,
        email,
        password,
        confirmPassword,
        nik,
        full_name,
        gender,
        address,
        id_card_photo
    } = req.body;

    const missingFields = [];

    if (!username) missingFields.push('username');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!confirmPassword) missingFields.push('confirm password');
    if (!nik) missingFields.push('nik');
    if (!full_name) missingFields.push('full name');
    if (!gender) missingFields.push('gender');
    if (!address) missingFields.push('address');
    if (!id_card_photo) missingFields.push('id card photo');

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: `${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required`,
            errorCode: 'INVALID_INPUT'
        });
    }

    // Username validation
    if (username.length < 3 || username.length > 50) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Username must be between 3 and 50 characters',
            errorCode: 'INVALID_USERNAME'
        });
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Invalid email format',
            errorCode: 'INVALID_EMAIL'
        });
    }

    // Password match and strength
    if (password !== confirmPassword) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Password and confirmPassword do not match',
            errorCode: 'PASSWORD_MISMATCH'
        });
    }
    if (password.length < 6) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Password must be at least 6 characters',
            errorCode: 'PASSWORD_TOO_SHORT'
        });
    }

    // NIK: only digits, 16–35
    const nikRegex = /^\d{16,35}$/;
    if (!nikRegex.test(nik)) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'NIK must be between 16 and 35 digits and contain only numbers',
            errorCode: 'INVALID_NIK'
        });
    }

    // Full name: minimum 3 chars
    if (full_name.trim().length < 3) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Full name must be at least 3 characters',
            errorCode: 'INVALID_FULL_NAME'
        });
    }

    // Gender validation
    const validGenders = ['Pria', 'Wanita'];
    if (!validGenders.includes(gender)) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Gender must be either "Pria" or "Wanita"',
            errorCode: 'INVALID_GENDER'
        });
    }

    // Address minimum length
    if (address.trim().length < 5) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'Address must be at least 5 characters',
            errorCode: 'ADDRESS_TOO_SHORT'
        });
    }

    // ID card photo basic check (not empty, string assumed)
    if (typeof id_card_photo !== 'string' || id_card_photo.trim().length === 0) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'ID card photo must be a valid non-empty string',
            errorCode: 'INVALID_ID_CARD_PHOTO'
        });
    }

    next();
};

module.exports = validateUserInputForRegistration;
