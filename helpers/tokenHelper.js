const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id, role = 'user', name = '') => {
    return jwt.sign(
        { id, role, name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};


function verifyToken(token) {
    if (!token) {
        throw new Error('TOKEN_INVALID'); // token kosong/null
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const id = decoded.sub || decoded.user_id || decoded.id;
        const role = decoded.role;
        const name = decoded.name || 'guest';

        if (!id || !role) {
            throw new Error('TOKEN_PAYLOAD_INVALID'); // payload tidak lengkap
        }

        return { id, role, name };

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new Error('TOKEN_EXPIRED');
        }

        throw new Error('TOKEN_INVALID');
    }
}

module.exports = {
    generateToken,
    verifyToken
};
