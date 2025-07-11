const { verifyToken } = require('../helpers/tokenHelper');

const authenticateToken = (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token found', errorCode: 'NO_TOKEN' });
    }

    try {
        const { id, role, name } = verifyToken(token);

        if (role === 'user') {
            req.user = { id, name, role };
        } else {
            req.admin = { id, name, role }; // admin atau super_admin
        }

        next();
    } catch (err) {
        return res.status(401).json({ status: 'error', message: err.message, errorCode: err.message });
    }
};

module.exports = { authenticateToken };