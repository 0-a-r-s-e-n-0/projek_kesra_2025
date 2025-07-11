const db = require('../Models');
const { DateTime } = require('luxon');
const { formatToWIB } = require('../helpers/timeHelper');
const { sendSuccess, sendError } = require('../helpers/responseHelper');
const generatePaginatedHelper = require('../helpers/generatePaginate');

// const Admin = db.Admin;
const User = db.User;
const userProfile = db.UserProfile;

const getAllUsers = generatePaginatedHelper(User, {
    include: [
        {
            model: userProfile,
            as: 'profile',
            attributes: ['profile_photo'] // ambil hanya foto
        }
    ],
    allowedSortFields: ['register_at', 'email', 'updated_at'],
    defaultSortBy: 'register_at',
    searchableFields: [, 'email'],
    customFilterFields: {
        gender: (value) => ({ gender: value }),
        is_verified: (value) => ({ is_verified: value === 'true' }),
        suspend: (value) => ({ suspend: value === 'true' })
    },
    defaultLimit: 10,
    maxLimit: 50,
    attributes: ['user_id', 'username', 'email', 'is_verified', 'nik', 'id_card_photo', 'gender', 'address'] // penting: field ringan!
}).getAll;

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId, {
            attributes: {
                exclude: ['password_hash'] // jangan kirim password ke frontend
            },
            include: [{
                model: userProfile,
                as: 'profile',
                attributes: [
                    'birth_date',
                    'phone_number',
                    'profile_photo',
                    'last_login',
                    'created_at',
                    'updated_at'
                ]
            }]
        });

        if (!user) {
            return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');
        }

        return sendSuccess(res, 200, 'User data retrieved successfully', user);

    } catch (err) {
        console.error('Error fetching user by ID:', err);
        return sendError(res, 500, 'Server error while retrieving user data', 'SERVER_ERROR');
    }
};

const verifyUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const adminId = req.admin.admin_id;

        const user = await User.findByPk(userId);
        if (!user) {
            return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');
        }

        user.is_verified = true;
        user.verified_at = formatToWIB(DateTime.now().toISO());
        user.verified_by_admin_id = adminId;
        await user.save();

        return sendSuccess(res, 200, 'User verified successfully',);

    } catch (err) {
        console.error('Error when verify user:', err);
        return sendError(res, 500, 'Server error while verify user account', 'SERVER_ERROR');
    }
};

const toggleUserSuspend = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { suspend } = req.body; // true atau false

        const user = await User.findByPk(userId);
        if (!user) {
            return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');
        }

        user.suspend = suspend;
        await user.save();

        return sendSuccess(res, 200, `User ${suspend ? 'suspended' : 'unsuspended'} successfully`, user);

    } catch (err) {
        console.error('Error when toggle suspend to user:', err);
        return sendError(res, 500, 'Server error while toggle suspend user account', 'SERVER_ERROR');
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    verifyUser,
    toggleUserSuspend
};
