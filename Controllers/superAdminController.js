const bcrypt = require('bcrypt');
const db = require('../Models');                                // sesuaikan path
const { sendSuccess, sendError } = require('../helpers/responseHelper');
const generatePaginatedHelper = require('../helpers/generatePaginate');

const Admin = db.Admin;

/* ────────────────────────────────────────────────────────── */
/* 1. CREATE ADMIN (super admin only)                        */
/* ────────────────────────────────────────────────────────── */
const createAdmin = async (req, res) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    try {
        if (req.admin.role !== 'super_admin') {
            return sendError(res, 403, 'Access denied', 'ACCESS_DENIED');
        }

        const {
            username,
            email,
            password,
            full_name,
            gender,
            phone_number
        } = req.body;

        if (
            !username ||
            !email ||
            !password ||
            !full_name ||
            !gender ||
            !phone_number
        ) {
            return sendError(res, 400, 'Missing required fields', 'VALIDATION_ERROR');
        }

        const password_hash = await bcrypt.hash(password, saltRounds);

        const admin = await Admin.create({
            username,
            email,
            password_hash,
            full_name,
            gender,
            phone_number
        });

        return sendSuccess(res, 201, 'Admin created', {
            admin_id: admin.admin_id
        });
    } catch (err) {
        console.error('Create admin error:', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return sendError(
                res,
                400,
                'Username, email, or phone already exists',
                'DUPLICATE_VALUE'
            );
        }
        return sendError(res, 500, 'Server error', 'SERVER_ERROR');
    }
};

/* ────────────────────────────────────────────────────────── */
/* 2. LIST + SEARCH + PAGINATION (super admin only)          */
/* ────────────────────────────────────────────────────────── */
const _adminPagination = generatePaginatedHelper(Admin, {
    defaultSortBy: 'created_at',
    allowedSortFields: ['created_at', 'updated_at', 'username', 'full_name'],
    searchableFields: ['username', 'email', 'full_name', 'phone_number'],
    customFilterFields: {
        suspend: (v) => ({ suspend: v === 'true' })
    },
    attributes: { exclude: ['password_hash'] }
});

const listAdmins = (req, res) => {
    if (req.admin.role !== 'super_admin') {
        return sendError(res, 403, 'Access denied', 'ACCESS_DENIED');
    }
    return _adminPagination.getAll(req, res);
};

/* ────────────────────────────────────────────────────────── */
/* 3. DETAIL ADMIN                                           */
/* ────────────────────────────────────────────────────────── */
const getAdminDetail = async (req, res) => {
    try {
        if (req.admin.role !== 'super_admin') {
            return sendError(res, 403, 'Access denied', 'ACCESS_DENIED');
        }

        const { id } = req.params;
        const admin = await Admin.findByPk(id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!admin) {
            return sendError(res, 404, 'Admin not found', 'ADMIN_NOT_FOUND');
        }

        return sendSuccess(res, 200, 'Admin detail', admin);
    } catch (err) {
        console.error('Get admin detail error:', err);
        return sendError(res, 500, 'Server error', 'SERVER_ERROR');
    }
};

/* ────────────────────────────────────────────────────────── */
/* 4. UPDATE ADMIN                                           */
/* ────────────────────────────────────────────────────────── */
const updateAdmin = async (req, res) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    try {
        if (req.admin.role !== 'super_admin') {
            return sendError(res, 403, 'Access denied', 'ACCESS_DENIED');
        }

        const { id } = req.params;
        const {
            username,
            email,
            password,
            full_name,
            gender,
            phone_number
        } = req.body;

        const admin = await Admin.findByPk(id);
        if (!admin)
            return sendError(res, 404, 'Admin not found', 'ADMIN_NOT_FOUND');

        if (username) admin.username = username;
        if (email) admin.email = email;
        if (full_name) admin.full_name = full_name;
        if (gender) admin.gender = gender;
        if (phone_number) admin.phone_number = phone_number;
        if (password) admin.password_hash = await bcrypt.hash(password, saltRounds);

        await admin.save();

        return sendSuccess(res, 200, 'Admin updated');
    } catch (err) {
        console.error('Update admin error:', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return sendError(
                res,
                400,
                'Username, email, or phone already exists',
                'DUPLICATE_VALUE'
            );
        }
        return sendError(res, 500, 'Server error', 'SERVER_ERROR');
    }
};

/* ────────────────────────────────────────────────────────── */
/* 5. SUSPEND / UNSUSPEND ADMIN                              */
/* ────────────────────────────────────────────────────────── */
const setSuspendAdmin = async (req, res) => {
    try {
        if (req.admin.role !== 'super_admin') {
            return sendError(res, 403, 'Access denied', 'ACCESS_DENIED');
        }

        const { id } = req.params;
        const { suspend } = req.body; // expect boolean true/false

        if (typeof suspend !== 'boolean') {
            return sendError(res, 400, 'Invalid suspend value', 'VALIDATION_ERROR');
        }

        const admin = await Admin.findByPk(id);
        if (!admin)
            return sendError(res, 404, 'Admin not found', 'ADMIN_NOT_FOUND');

        admin.suspend = suspend;
        await admin.save();

        return sendSuccess(res, 200, `${suspend ? 'Suspended' : 'Re‑activated'} admin`);
    } catch (err) {
        console.error('Suspend admin error:', err);
        return sendError(res, 500, 'Server error', 'SERVER_ERROR');
    }
};

/* ────────────────────────────────────────────────────────── */
/* 6. DELETE ADMIN                                           */
/* ────────────────────────────────────────────────────────── */
const deleteAdmin = async (req, res) => {
    try {
        if (req.admin.role !== 'super_admin') {
            return sendError(res, 403, 'Access denied', 'ACCESS_DENIED');
        }

        const { id } = req.params;
        const removed = await Admin.destroy({ where: { admin_id: id } });

        if (!removed) {
            return sendError(res, 404, 'Admin not found', 'ADMIN_NOT_FOUND');
        }

        return sendSuccess(res, 200, 'Admin deleted');
    } catch (err) {
        console.error('Delete admin error:', err);
        return sendError(res, 500, 'Server error', 'SERVER_ERROR');
    }
};

module.exports = {
    createAdmin,
    listAdmins,
    getAdminDetail,
    updateAdmin,
    setSuspendAdmin,
    deleteAdmin
};
