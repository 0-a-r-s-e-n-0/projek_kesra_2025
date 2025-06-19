const db = require('../Models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/tokenHelper');
const { setAuthCookie } = require('../helpers/cookieHelper');
const { sendSuccess, sendError } = require('../helpers/responseHelper');

const Admin = db.Admin;

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ where: { email } });
        if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
            return sendError(res, 401, 'Invalid email or password', 'INVALID_CREDENTIALS');
        }

        const token = generateToken(admin.admin_id, 'admin');
        setAuthCookie(res, token);

        return sendSuccess(res, 200, 'Admin logged in successfully', {
            token,
            admin: {
                admin_id: admin.admin_id,
                full_name: admin.full_name,
                email: admin.email
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return sendError(res, 500, 'Login failed due to server error', 'SERVER_ERROR');
    }
};

module.exports = {
    login
};
