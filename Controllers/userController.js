const bcrypt = require("bcrypt");
const db = require("../Models");
const { generateToken } = require('../helpers/tokenHelper');
const { setAuthCookie, clearAuthCookie } = require('../helpers/cookieHelper');
const { getUploadedFilePath, deleteUploadedFile, removeFileIfExists } = require('../helpers/fileHelper');
const { sendSuccess, sendError } = require('../helpers/responseHelper');
const { formatToWIB } = require('../helpers/timeHelper');
const { Op } = require("sequelize");

require('dotenv').config();

const User = db.User;
const Admin = db.Admin;
const SuperAdmin = db.SuperAdmin;
const UserProfile = db.UserProfile;

const signup = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

    try {
        const { username, email, password, nik, full_name, gender, address } = req.body;
        const file = req.files?.id_card?.[0];
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

        let account = await SuperAdmin.findOne({ where: { email } });
        let role = "super_admin";

        if (!account) {
            account = await Admin.findOne({ where: { email } });
            role = "admin";
        }
        if (!account) {
            account = await User.findOne({ where: { email } });
            role = "user";
        }

        if (!account || !(await bcrypt.compare(password, account.password_hash))) {
            return sendError(res, 401, "Invalid email or password", "INVALID_CREDENTIALS");
        }

        // verifikasi status
        if (role === "user" && !account.is_verified) {
            return sendError(res, 403, "Your account has not been verified by an admin yet", "USER_NOT_VERIFIED");
        }
        if ((role === "admin") && account.suspend) {
            return sendError(res, 403, "Account is suspended", "ACCOUNT_SUSPENDED");
        }

        // id field mapping
        const idField = role === "user"
            ? "user_id"
            : role === "admin"
                ? "admin_id"
                : "super_admin_id";

        const token = generateToken(account[idField], role, account.username);
        setAuthCookie(res, token);

        // update last_login untuk user
        if (role === "user") {
            await UserProfile.update(
                { last_login: new Date() },
                { where: { user_id: account[idField] } }
            );
        }

        /* ──────────────── bentuk payload spesifik per role ──────────────── */
        let payload;
        if (role === "user") {
            payload = {
                user_id: account.user_id,
                username: account.username,
                email: account.email,
                nik: account.nik,
                full_name: account.full_name,
                gender: account.gender,
                address: account.address,
                id_card_photo: account.id_card_photo,
                register_at: formatToWIB(account.register_at),
                is_verified: account.is_verified,
                verified_at: formatToWIB(account.verified_at),
                verified_by_admin_id: account.verified_by_admin_id
            };
        } else if (role === "admin") {
            payload = {
                admin_id: account.admin_id,
                username: account.username,
                email: account.email,
                full_name: account.full_name,
                role: account.role
            };
        } else { // super_admin
            payload = {
                super_admin_id: account.super_admin_id,
                username: account.username,
                email: account.email,
                full_name: account.full_name,
                role: account.role
            };
        }

        const roleName = role === "user"
            ? "User"
            : role === "admin"
                ? "Admin"
                : "Super admin";

        return sendSuccess(res, 200, `${roleName} logged in successfully`, {
            token,
            role,
            [role]: payload
        });

    } catch (err) {
        console.error("Login error:", err);
        return sendError(res, 500, "An unexpected error occurred during login", "SERVER_ERROR");
    }
};


/**
 * Universal logout – works for user, admin, super_admin
 * Expect middleware that injects req.user OR req.admin if token valid.
 */
const logout = (req, res) => {
    try {
        // siapa yg login?
        let role = null;
        if (req.admin) role = req.admin.role;   // "admin" | "super_admin"
        else if (req.user) role = 'user';

        // kalau tidak ada sesi ter‑autentikasi
        if (!role) {
            return sendError(res, 401, 'No active session', 'UNAUTHORIZED');
        }

        // hapus cookie JWT
        clearAuthCookie(res);

        return sendSuccess(
            res,
            200,
            `${role === 'user' ? 'User'
                : role === 'super_admin' ? 'Super admin'
                    : 'Admin'} logged out successfully`
        );
    } catch (err) {
        console.error('Universal logout error:', err);
        return sendError(res, 500, 'Server error during logout', 'SERVER_ERROR');
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user?.user_id;

        if (!userId) {
            return sendError(res, 401, 'Unauthorized: user token missing', 'UNAUTHORIZED');
        }

        const userInstance = await User.findByPk(userId, {
            attributes: { exclude: ['password_hash'] },
            include: [
                {
                    model: UserProfile,
                    as: 'profile',
                    attributes: ['birth_date', 'phone_number', 'profile_photo', 'updated_at', 'last_login']
                }
            ]
        });

        if (!userInstance) {
            return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');
        }

        const user = userInstance.get({ plain: true }); // 💡 ambil plain object
        const profile = user.profile || {};

        if (profile.updated_at) {
            profile.updated_at = formatToWIB(profile.updated_at);
        }
        if (profile.last_login) {
            profile.last_login = formatToWIB(profile.last_login);
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
            profile: profile
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
        birth_date,
        phone_number
    } = req.body;

    const transaction = await db.sequelize.transaction();
    let committed = false;

    try {
        const user = await db.User.findByPk(userId, { transaction });
        const profile = await db.UserProfile.findOne({ where: { user_id: userId }, transaction });

        if (!user || !profile) {
            await transaction.rollback();
            deleteUploadedFile(req.files);
            return sendError(res, 404, 'User or profile not found', 'DATA_NOT_FOUND');
        }

        // ⏬ Ambil path file upload jika dikirim
        const newIdCardPhoto = req.files?.id_card?.[0] ? getUploadedFilePath(req.files.id_card[0]) : undefined;
        const newProfilePhoto = req.files?.profile_photo?.[0] ? getUploadedFilePath(req.files.profile_photo[0]) : undefined;

        const userData = {};
        const profileData = {};

        // 🔄 Deteksi perubahan user
        const userFields = { username, email, nik, full_name, gender, address, id_card_photo: newIdCardPhoto };
        for (const key in userFields) {
            if (userFields[key] !== undefined && user[key] !== userFields[key]) {
                if (key === 'id_card_photo' && user.id_card_photo) {
                    removeFileIfExists(user.id_card_photo);
                }
                userData[key] = userFields[key];
            }
        }

        if (birth_date !== undefined && profile.birth_date !== birth_date) {
            profileData.birth_date = birth_date;
        }

        if (phone_number !== undefined && profile.phone_number !== phone_number) {
            profileData.phone_number = phone_number;
        }

        if (newProfilePhoto !== undefined && profile.profile_photo !== newProfilePhoto) {
            if (profile.profile_photo) {
                removeFileIfExists(profile.profile_photo);
            }
            profileData.profile_photo = newProfilePhoto;
        }

        // Cek duplikat username/email/nik
        if (username && user.username !== username) {
            const exists = await db.User.findOne({ where: { username, user_id: { [Op.ne]: userId } } });
            if (exists) {
                await transaction.rollback();
                deleteUploadedFile(req.files);
                return sendError(res, 400, 'Username is already in use', 'USERNAME_EXISTS');
            }
        }

        if (email && user.email !== email) {
            const exists = await db.User.findOne({ where: { email, user_id: { [Op.ne]: userId } } });
            if (exists) {
                await transaction.rollback();
                deleteUploadedFile(req.files);
                return sendError(res, 400, 'Email is already in use', 'EMAIL_EXISTS');
            }
        }

        if (nik && user.nik !== nik) {
            const exists = await db.User.findOne({ where: { nik, user_id: { [Op.ne]: userId } } });
            if (exists) {
                await transaction.rollback();
                deleteUploadedFile(req.files);
                return sendError(res, 400, 'NIK is already in use', 'NIK_EXISTS');
            }
        }

        const userNeedsUpdate = Object.keys(userData).length > 0;
        const profileNeedsUpdate = Object.keys(profileData).length > 0;

        if (!userNeedsUpdate && !profileNeedsUpdate) {
            await transaction.rollback();
            return sendSuccess(res, 200, 'No changes detected. Nothing updated.', { user, profile });
        }

        // 🔁 Update DB
        if (userNeedsUpdate) await db.User.update(userData, { where: { user_id: userId }, transaction });
        if (profileNeedsUpdate) await db.UserProfile.update(profileData, { where: { user_id: userId }, transaction });

        await transaction.commit();
        committed = true;

        const updatedUser = await db.User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
        const updatedProfile = await db.UserProfile.findOne({ where: { user_id: userId } });

        // Format waktu WIB
        if (updatedUser?.updated_at) updatedUser.dataValues.updated_at = formatToWIB(updatedUser.updated_at);
        if (updatedProfile?.updated_at) updatedProfile.dataValues.updated_at = formatToWIB(updatedProfile.updated_at);

        return sendSuccess(res, 200, 'User and profile updated successfully', {
            user: updatedUser,
            profile: updatedProfile
        });

    } catch (err) {
        if (!committed) await transaction.rollback();
        console.error('Update user & profile error:', err);
        return sendError(res, 500, 'An unexpected error occurred during update', 'SERVER_ERROR');
    }
};

module.exports = {
    signup,
    login,
    logout,
    getProfile,
    updateUserData
};