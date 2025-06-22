const db = require('../Models');
const { DateTime } = require('luxon');
const { Op } = require('sequelize');
// const { generateToken } = require('../helpers/tokenHelper');
// const { setAuthCookie } = require('../helpers/cookieHelper');
const { formatToWIB } = require('../helpers/timeHelper');
const { sendSuccess, sendError } = require('../helpers/responseHelper');
const generatePaginatedHelper = require('../helpers/generatePaginate');

// const Admin = db.Admin;
const User = db.User;
const userProfile = db.UserProfile;

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const admin = await Admin.findOne({ where: { email } });
//         if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
//             return sendError(res, 401, 'Invalid email or password', 'INVALID_CREDENTIALS');
//         }

//         const token = generateToken(admin.admin_id, 'admin');
//         setAuthCookie(res, token);

//         return sendSuccess(res, 200, 'Admin logged in successfully', {
//             token,
//             admin: {
//                 admin_id: admin.admin_id,
//                 full_name: admin.full_name,
//                 email: admin.email
//             }
//         });

//     } catch (error) {
//         console.error('Admin login error:', error);
//         return sendError(res, 500, 'Login failed due to server error', 'SERVER_ERROR');
//     }
// };

const getAllUsers = generatePaginatedHelper(User, {
    include: [
        {
            model: userProfile,
            as: 'profile'
        }
    ],
    allowedSortFields: ['register_at', 'full_name', 'email', 'updated_at'],
    defaultSortBy: 'register_at',
    searchableFields: ['full_name', 'email'],
    customFilterBuilder: (query) => {
        const filters = {};
        if (query.gender) filters.gender = query.gender;
        if (query.is_verified !== undefined) filters.is_verified = query.is_verified === 'true';
        if (query.suspend !== undefined) filters.suspend = query.suspend === 'true';
        return filters;
    }
}).getAll;

const verifyUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const adminId = req.admin.admin_id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        user.is_verified = true;
        user.verified_at = formatToWIB(DateTime.now().toISO());
        user.verified_by_admin_id = adminId;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'User verified successfully',
            data: user
        });
    } catch (err) {
        next(err);
    }
};

const toggleUserSuspend = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { suspend } = req.body; // true atau false

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        user.suspend = suspend;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: `User ${suspend ? 'suspended' : 'unsuspended'} successfully`
        });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    // login,
    getAllUsers,
    verifyUser,
    toggleUserSuspend
};
