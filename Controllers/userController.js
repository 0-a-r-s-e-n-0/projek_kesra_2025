const bcrypt = require("bcrypt");
const db = require("../Models");
const { generateToken } = require('../helpers/tokenHelper');
const { setAuthCookie } = require('../helpers/cookieHelper');
const { getUploadedFilePath, deleteUploadedFile } = require('../helpers/fileHelper');
const { sendSuccess, sendError } = require('../helpers/responseHelper');
const { formatToWIB } = require('../helpers/timeHelper');
const { Op } = require("sequelize");

require('dotenv').config();

const User = db.User;
const UserProfile = db.UserProfile;

const signup = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

    try {
        const { username, email, password, nik, full_name, gender, address } = req.body;
        const file = req.files?.id_card_photo?.[0];
        const photoPath = getUploadedFilePath(file);

        const user = await User.create({
            username,
            email,
            password_hash: await bcrypt.hash(password, saltRounds),
            nik,
            full_name,
            gender,
            address,
            id_card_photo: photoPath
        }, { transaction });

        await UserProfile.create({ user_id: user.user_id }, { transaction });
        await transaction.commit();

        return sendSuccess(res, 201, 'User registered successfully', {
            username: user.username,
            email: user.email,
            full_name: user.full_name,
        });

    } catch (error) {
        await transaction.rollback();
        deleteUploadedFile(req.file);
        console.error('Signup error:', error);
        return sendError(res, 500, 'An unexpected error occurred during register', 'SERVER_ERROR');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return sendError(res, 401, 'Invalid email or password', 'INVALID_CREDENTIALS');
        }

        if (!user.is_verified) {
            return sendError(res, 403, 'Your account has not been verified by an admin yet', 'USER_NOT_VERIFIED');
        }

        const token = generateToken(user.user_id);
        setAuthCookie(res, token);

        return sendSuccess(res, 200, 'User logged in successfully', {
            token: token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                nik: user.nik,
                full_name: user.full_name,
                gender: user.gender,
                address: user.address,
                id_card_photo: user.id_card_photo,
                register_at: formatToWIB(user.register_at),
                is_verified: user.is_verified,
                verified_at: formatToWIB(user.verified_at),
                verified_by_admin_id: user.verified_by_admin_id,
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return sendError(res, 500, 'An unexpected error occurred during login', 'SERVER_ERROR');
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user?.user_id;

        if (!userId) {
            return sendError(res, 401, 'Unauthorized: user token missing', 'UNAUTHORIZED');
        }

        const user = await User.findByPk(userId, {
            attributes: {
                exclude: ['password_hash']
            },
            include: [
                {
                    model: UserProfile,
                    as: 'profile',
                    attributes: ['birth_date', 'phone_number', 'profile_photo', 'updated_at']
                }
            ]
        });

        if (!user) {
            return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');
        }

        return sendSuccess(res, 200, 'User profile retrieved successfully', {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            nik: user.nik,
            full_name: user.full_name,
            gender: user.gender,
            address: user.address,
            id_card_photo: user.id_card_photo,
            register_at: formatToWIB(user.register_at),
            is_verified: user.is_verified,
            verified_at: formatToWIB(user.verified_at),
            verified_by_admin_id: user.verified_by_admin_id,
            profile: user.profile || {}
        });

    } catch (error) {
        console.error('Get profile error:', error);
        return sendError(res, 500, 'Server error while retrieving profile', 'SERVER_ERROR');
    }
};

const updateUserData = async (req, res) => {
    const userId = req.user?.user_id;
    if (!userId) {
        return sendError(res, 401, 'Unauthorized: user token missing', 'UNAUTHORIZED');
    }

    const {
        username,
        email,
        nik,
        full_name,
        gender,
        address,
        id_card_photo,
        birth_date,
        phone_number,
        profile_photo
    } = req.body;

    const transaction = await db.sequelize.transaction();
    let committed = false;

    try {
        const user = await User.findByPk(userId, { transaction });
        const profile = await UserProfile.findOne({ where: { user_id: userId }, transaction });

        if (!user || !profile) {
            await transaction.rollback();
            deleteUploadedFile(req.files);
            return sendError(res, 404, 'User or profile not found', 'DATA_NOT_FOUND');
        }

        // 🔒 Validasi unik email & nik
        if (email) {
            const emailExists = await User.findOne({
                where: {
                    email,
                    user_id: { [Op.ne]: userId }
                }
            });
            if (emailExists) {
                await transaction.rollback();
                deleteUploadedFile(req.files);
                return sendError(res, 400, 'Email is already in use by another user', 'EMAIL_EXISTS');
            }
        }

        if (nik) {
            const nikExists = await User.findOne({
                where: {
                    nik,
                    user_id: { [Op.ne]: userId }
                }
            });
            if (nikExists) {
                await transaction.rollback();
                deleteUploadedFile(req.files);
                return sendError(res, 400, 'NIK is already in use by another user', 'NIK_EXISTS');
            }
        }

        // 🚧 Bangun data update dinamis
        const userData = {};
        const profileData = {};

        if (username) userData.username = username;
        if (email) userData.email = email;
        if (nik) userData.nik = nik;
        if (full_name) userData.full_name = full_name;
        if (gender) userData.gender = gender;
        if (address) userData.address = address;
        if (id_card_photo) userData.id_card_photo = id_card_photo;

        if (birth_date !== undefined) profileData.birth_date = birth_date || null;
        if (phone_number !== undefined) profileData.phone_number = phone_number || null;
        if (profile_photo !== undefined) profileData.profile_photo = profile_photo || null;

        await Promise.all([
            User.update(userData, { where: { user_id: userId }, transaction }),
            UserProfile.update(profileData, { where: { user_id: userId }, transaction })
        ]);

        await transaction.commit();
        committed = true;

        const updatedUser = await User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
        const updatedProfile = await UserProfile.findOne({ where: { user_id: userId } });

        if (updatedUser?.updated_at) {
            updatedUser.dataValues.updated_at = formatToWIB(updatedUser.updated_at);
        }

        if (updatedProfile?.updated_at) {
            updatedProfile.dataValues.updated_at = formatToWIB(updatedProfile.updated_at);
        }

        return sendSuccess(res, 200, 'User and profile updated successfully', {
            user: updatedUser,
            profile: updatedProfile
        });

    } catch (error) {
        if (!committed) {
            await transaction.rollback();
        }
        console.error('Update user & profile error:', error);
        return sendError(res, 500, 'An unexpected error occurred during update', 'SERVER_ERROR');
    }
};

module.exports = {
    signup,
    login,
    getProfile,
    updateUserData
};