const db = require('../Models');
const { verifyToken } = require('../helpers/tokenHelper');
const { deleteUploadedFile } = require('../helpers/fileHelper');
require('dotenv').config();

const User = db.User;
const Admin = db.Admin;
const SuperAdmin = db.SuperAdmin;

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

const userAuth = async (req, res, next) => {
    try {
        /* 1️⃣ Ambil token dari cookie atau header */
        const token =
            req.cookies.jwt ||
            (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'No token provided',
                errorCode: 'AUTH_TOKEN_MISSING'
            });
        }

        /* 2️⃣ Verifikasi & decode token */
        const decoded = verifyToken(token);

        if (decoded.role !== 'user') {
            return res.status(403).json({
                status: 'error',
                statusCode: 403,
                message: 'Access denied: not a user',
                errorCode: 'ACCESS_DENIED'
            });
        }

        /* 3️⃣ Ambil data user di database */
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'User not found',
                errorCode: 'USER_NOT_FOUND'
            });
        }

        /* 4️⃣ Cek suspensi */
        if (user.suspend === true) {
            return res.status(403).json({
                status: 'error',
                statusCode: 403,
                message: 'Account is suspended. You can only view your data.',
                errorCode: 'USER_SUSPENDED'
            });
        }

        /* 5️⃣ Pasang data user ke req untuk dipakai controller */
        const ip =
            req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(
            `[AUTH] user ${decoded.id} access from IP ${ip} at ${new Date().toISOString()}`
        );

        req.user = {
            user_id: decoded.id,
            username: decoded.name,
            role: decoded.role,
            suspend: user.suspend
        };

        next();
    } catch (error) {
        /* 🎯 Mapping error token */
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

const allUserAuth = async (req, res, next) => {
    try {
        // 1️⃣ Ambil token dari cookie atau header
        const token =
            req.cookies?.jwt ||
            (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'No token provided',
                errorCode: 'AUTH_TOKEN_MISSING'
            });
        }

        // 2️⃣ Verifikasi token
        const decoded = verifyToken(token);

        const allowedRoles = ['user', 'admin', 'super_admin'];
        const { id, name, role } = decoded;

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                status: 'error',
                statusCode: 403,
                message: 'Access denied: Role not allowed',
                errorCode: 'ACCESS_DENIED'
            });
        }

        // 3️⃣ Ambil user dari tabel sesuai role
        let account = null;

        if (role === 'user') {
            account = await User.findByPk(id);
        } else if (role === 'admin') {
            account = await Admin.findByPk(id);
        } else if (role === 'super_admin') {
            account = await SuperAdmin.findByPk(id);
        }

        if (!account) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'Account not found',
                errorCode: 'ACCOUNT_NOT_FOUND'
            });
        }

        // 4️⃣ Jika punya field `suspend`, cek statusnya
        if ('suspend' in account && account.suspend === true) {
            return res.status(403).json({
                status: 'error',
                statusCode: 403,
                message: 'Account is suspended. You can only view your data.',
                errorCode: 'ACCOUNT_SUSPENDED'
            });
        }

        // 5️⃣ Simpan info user ke req.user
        req.user = {
            id: id,
            username: name,
            role: role,
        };

        // 🔎 Logging akses
        const ip =
            req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(
            `[AUTH] Role: ${role} | ID: ${id} | IP: ${ip} | Time: ${new Date().toISOString()}`
        );

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

        console.error('[AUTH ERROR]', error);
        return res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
            errorCode
        });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        /* 1️⃣ Ambil token dari cookie atau header */
        const token =
            req.cookies.jwt ||
            (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'No token provided',
                errorCode: 'AUTH_TOKEN_MISSING'
            });
        }

        /* 2️⃣ Verifikasi token */
        const decoded = verifyToken(token); // { id, name, role, ... }
        const isSuper = decoded.role === 'super_admin';
        const isAdmin = decoded.role === 'admin';

        if (!isSuper && !isAdmin) {
            return res.status(403).json({
                status: 'error',
                statusCode: 403,
                message: 'Access denied: not an admin',
                errorCode: 'ACCESS_DENIED'
            });
        }

        /* 3️⃣ Ambil data user dari DB */
        let admin = null;

        if (isSuper) {
            admin = await SuperAdmin.findByPk(decoded.id);
        } else {
            admin = await Admin.findByPk(decoded.id);
        }

        if (!admin) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'Admin not found',
                errorCode: 'ADMIN_NOT_FOUND'
            });
        }

        /* 4️⃣ Jika role = admin, cek apakah suspend */
        if (isAdmin && admin.suspend === true) {
            return res.status(403).json({
                status: 'error',
                statusCode: 403,
                message: 'Account is suspended. Contact super admin.',
                errorCode: 'ADMIN_SUSPENDED'
            });
        }

        /* 5️⃣ Logging dan inject ke req */
        const ip =
            req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log(
            `[AUTH] ${decoded.role} ${decoded.id} access from IP ${ip} at ${new Date().toISOString()}`
        );

        req.admin = {
            admin_id: decoded.id,
            username: decoded.name,
            role: decoded.role,
            suspend: admin.suspend || false
        };

        next();
    } catch (error) {
        /* 🎯 Mapping error token */
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

        console.error('Admin auth error:', error);
        return res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
            errorCode
        });
    }
};

const superAdminAuth = async (req, res, next) => {
    try {
        /* 1️⃣ Ambil token dari cookie atau header */
        const token =
            req.cookies.jwt ||
            (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'No token provided',
                errorCode: 'AUTH_TOKEN_MISSING'
            });
        }

        /* 2️⃣ Verifikasi & decode token */
        const decoded = verifyToken(token); // { id, name, role }

        if (decoded.role !== 'super_admin') {
            return res.status(403).json({
                status: 'error',
                statusCode: 403,
                message: 'Access denied: not a super admin',
                errorCode: 'ACCESS_DENIED'
            });
        }

        /* 3️⃣ Ambil data admin dari database */
        const admin = await SuperAdmin.findByPk(decoded.id);
        if (!admin) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'Super admin not found',
                errorCode: 'SUPER_ADMIN_NOT_FOUND'
            });
        }

        /* 5️⃣ Logging & inject ke req */
        const ip =
            req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log(
            `[AUTH] super_admin ${decoded.id} access from IP ${ip} at ${new Date().toISOString()}`
        );

        req.admin = {
            admin_id: decoded.id,
            username: decoded.name,
            role: decoded.role,
        };

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

        console.error('Super admin auth error:', error);
        return res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
            errorCode
        });
    }
};

module.exports = { userAuth, saveUser, adminAuth, superAdminAuth, allUserAuth };
