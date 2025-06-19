const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.sub || decoded.user_id || decoded.id;
        if (!userId) {
            throw new Error('TOKEN_PAYLOAD_INVALID');
        }
        return userId;
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
