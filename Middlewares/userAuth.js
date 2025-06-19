const db = require('../Models');
const { verifyToken } = require('../helpers/tokenHelper');
const { deleteUploadedFile } = require('../helpers/fileHelper');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = db.User;

// Middleware to check if username or email already exists
const saveUser = async (req, res, next) => {
    try {
        const { username, email, nik } = req.body;
        const [existingUsername, existingEmail, existingNIK] = await Promise.all([
            User.findOne({ where: { username } }),
            User.findOne({ where: { email } }),
            User.findOne({ where: { nik } }),
        ]);

        if (existingUsername) {
            deleteUploadedFile(req.files);
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                message: 'Username already taken',
                errorCode: 'CONFLICT_USERNAME'
            });
        }

        if (existingEmail) {
            deleteUploadedFile(req.files);
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                message: 'Email already taken',
                errorCode: 'CONFLICT_EMAIL'
            });
        }

        if (existingNIK) {
            deleteUploadedFile(req.files);
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                message: 'NIK already taken',
                errorCode: 'CONFLICT_NIK'
            });
        }

        next();
    } catch (error) {
        deleteUploadedFile(req.files);
        console.error('Save user error:', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'An unexpected error occurred on the server',
            errorCode: 'SERVER_ERROR'
        });
    }
};

// Middleware to check if user is authenticate or not
const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        if (!token) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'No token provided',
                errorCode: 'AUTH_TOKEN_MISSING'
            });
        }

        const userId = verifyToken(token); // ✅ pakai helper

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'User not found',
                errorCode: 'USER_NOT_FOUND'
            });
        }

        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(`[AUTH] user ${userId} access from IP ${ip} at ${new Date().toISOString()}`);

        req.user = { user_id: userId };
        next();
    } catch (error) {
        let message = 'Server error during authentication';
        let errorCode = 'SERVER_ERROR';
        let statusCode = 500;

        if (error.message === 'TOKEN_EXPIRED') {
            message = 'Token has expired';
            errorCode = 'TOKEN_EXPIRED';
            statusCode = 401;
        } else if (error.message === 'TOKEN_INVALID') {
            message = 'Invalid token';
            errorCode = 'TOKEN_INVALID';
            statusCode = 401;
        } else if (error.message === 'TOKEN_PAYLOAD_INVALID') {
            message = 'Invalid token payload';
            errorCode = 'TOKEN_PAYLOAD_INVALID';
            statusCode = 401;
        }

        console.error('Auth error:', error);
        return res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
            errorCode
        });
    }
};

module.exports = { userAuth, saveUser };
