const db = require('../Models');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const User = db.User;

// Middleware to check if username or email already exists
const saveUser = async (req, res, next) => {
    try {
        const { username, email, nik } = req.body;
        // if (!username || !email) {
        //     return res.status(400).json({
        //         status: 'error',
        //         statusCode: 400,
        //         message: 'Username and email are required',
        //         errorCode: 'INVALID_INPUT'
        //     });
        // }

        // Check if username exists
        const existingUsername = await User.findOne({
            where: { username }
        });
        if (existingUsername) {
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                message: 'Username already taken',
                errorCode: 'CONFLICT_USERNAME'
            });
        }

        // Check if email exists
        const existingEmail = await User.findOne({
            where: { email }
        });
        if (existingEmail) {
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                message: 'Email already taken',
                errorCode: 'CONFLICT_EMAIL'
            });
        }

        // Check if nik exists
        const existingNIK = await User.findOne({
            where: { nik }
        });
        if (existingNIK) {
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                message: 'NIK already taken',
                errorCode: 'CONFLICT_NIK'
            });
        }

        next();
    } catch (error) {
        console.error('Save user error:', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'An unexpected error occurred on the server',
            errorCode: 'SERVER_ERROR'
        });
    }
};

const userAuth = async (req, res, next) => {
    try {
        // Ambil token dari cookie atau header
        const token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'No token provided',
                errorCode: 'AUTH_TOKEN_MISSING'
            });
        }

        // Verifikasi token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    statusCode: 401,
                    message: 'Token has expired',
                    errorCode: 'TOKEN_EXPIRED'
                });
            } else {
                return res.status(401).json({
                    status: 'error',
                    statusCode: 401,
                    message: 'Invalid token',
                    errorCode: 'TOKEN_INVALID'
                });
            }
        }

        const userId = decoded.sub || decoded.user_id || decoded.id;
        if (!userId) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'Invalid token payload',
                errorCode: 'TOKEN_PAYLOAD_INVALID'
            });
        }

        // Opsional: cek apakah user masih ada di DB
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'User not found',
                errorCode: 'USER_NOT_FOUND'
            });
        }

        req.user = { user_id: userId }; // Atau: req.user = user; kalau mau lengkap
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Server error during authentication',
            errorCode: 'SERVER_ERROR'
        });
    }
};


module.exports = { userAuth, saveUser };