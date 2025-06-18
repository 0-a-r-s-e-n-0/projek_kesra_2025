const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { DateTime } = require('luxon');
require('dotenv').config();

const User = db.User;
const UserProfile = db.UserProfile;

const signup = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {

        const { username, email, password, nik, full_name, gender, address, id_card_photo } = req.body;

        const data = {
            username,
            email,
            password_hash: await bcrypt.hash(password, 10),
            nik,
            full_name,
            gender,
            address,
            id_card_photo
        };

        const user = await User.create(data, { transaction });

        if (user) {
            // Create user profile
            await UserProfile.create({
                user_id: user.user_id,
            }, { transaction });

            await transaction.commit();

            // console.log('User register:', JSON.stringify(user, null, 2));
            // console.log('UserProfile created:', JSON.stringify(userProfile, null, 2));

            return res.status(201).json({
                status: 'success',
                statusCode: 201,
                message: 'User registered successfully',
                data: {
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                }
            });
        } else {
            await transaction.rollback();
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                message: 'Details are not correct"',
                errorCode: 'CONFLICT_DATA'
            });
        }
    } catch (error) {
        await transaction.rollback();

        console.error('Signup error:', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'An unexpected error occurred during register',
            errorCode: 'SERVER_ERROR'
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'Email and password are required',
                errorCode: 'INVALID_INPUT'
            });
        }

        const user = await User.findOne({
            where: {
                email: email
            }

        });

        if (user) {
            const isSame = await bcrypt.compare(password, user.password_hash);

            //generate token with the user's id and the secretKey in the env file
            if (isSame) {

                if (!user.is_verified) {
                    return res.status(403).json({
                        status: 'error',
                        statusCode: 403,
                        message: 'Your account has not been verified by an admin yet',
                        errorCode: 'USER_NOT_VERIFIED'
                    });
                }

                const payload = {
                    id: user.user_id,
                };

                let token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });

                const register_at = DateTime.fromJSDate(user.register_at)
                    .setZone('Asia/Jakarta')
                    .toFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZZ");

                //go ahead and generate a cookie for the user
                res.cookie("jwt", token, {
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    // secure: true,        // Hanya dikirim lewat HTTPS (gunakan saat production)
                    // sameSite: 'strict'   // Lindungi dari CSRF, tergantung kebutuhan
                });

                // console.log('User login:', JSON.stringify(user, null, 2));
                // console.log('User profile:', JSON.stringify(profile, null, 2));
                // console.log('Token:', token);

                return res.status(200).json({
                    status: 'success',
                    statusCode: 200,
                    message: 'User logged in successfully',
                    data: {
                        "Token: ": token,
                        "User": {
                            user_id: user.user_id,
                            username: user.username,
                            email: user.email,
                            nik: user.nik,
                            full_name: user.full_name,
                            gender: user.gender,
                            address: user.address,
                            id_card_photo: user.id_card_photo,
                            register_at: register_at,
                            is_verified: user.is_verified,
                            verified_at: user.verified_at,
                            verified_by_admin_id: user.verified_by_admin_id,
                        },
                    }
                });
            } else {
                return res.status(401).json({
                    status: 'error',
                    statusCode: 401,
                    message: 'Invalid email or password',
                    errorCode: 'INVALID_CREDENTIALS'
                });
            }
        } else {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                message: 'Invalid email or password',
                errorCode: 'INVALID_CREDENTIALS'
            });
        }
    } catch (error) {
        console.log('Login error:', error);

        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'An unexpected error occurred during login',
            errorCode: 'SERVER_ERROR'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user?.user_id;

        const profile = await UserProfile.findOne({ where: { user_id: userId } });

        if (profile) {
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'User profile retrieved successfully',
                data: profile
            });
        }

        return res.status(404).json({
            status: 'error',
            statusCode: 404,
            message: 'User not found',
            errorCode: 'USER_NOT_FOUND'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Server error while retrieving profile',
            errorCode: 'SERVER_ERROR'
        });
    }
}

const updateUserData = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const userId = req.user?.user_id;
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

        if (
            !username && !email && !nik && !full_name && !gender && !address && !id_card_photo &&
            !birth_date && !phone_number && !profile_photo
        ) {
            return res.status(400).json({
                status: 'error',
                statusCode: 400,
                message: 'At least one field must be provided',
                errorCode: 'INVALID_INPUT'
            });
        }

        // Cari user dan profile
        const user = await User.findByPk(userId, { transaction });
        const profile = await UserProfile.findOne({ where: { user_id: userId }, transaction });

        if (!user || !profile) {
            await transaction.rollback();
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                message: 'User or profile not found',
                errorCode: 'DATA_NOT_FOUND'
            });
        }

        const userData = {};
        if (username !== undefined) userData.username = username;
        if (email !== undefined) userData.email = email;
        if (nik !== undefined) userData.nik = nik;
        if (full_name !== undefined) userData.full_name = full_name;
        if (gender !== undefined) userData.gender = gender;
        if (address !== undefined) userData.address = address;
        if (id_card_photo !== undefined) userData.id_card_photo = id_card_photo;
        userData.updated_at = new Date();

        const profileData = {};
        if (birth_date !== undefined) profileData.birth_date = birth_date || null;
        if (phone_number !== undefined) profileData.phone_number = phone_number || null;
        if (profile_photo !== undefined) profileData.profile_photo = profile_photo || null;
        profileData.updated_at = new Date();

        // Update user dan profile secara paralel
        await Promise.all([
            User.update(userData, { where: { user_id: userId }, transaction }),
            UserProfile.update(profileData, { where: { user_id: userId }, transaction })
        ]);

        await transaction.commit();

        const updatedUser = await User.findByPk(userId);
        const updatedProfile = await UserProfile.findOne({ where: { user_id: userId } });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'User and profile updated successfully',
            data: {
                user: {
                    user_id: updatedUser.user_id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    nik: updatedUser.nik,
                    full_name: updatedUser.full_name,
                    gender: updatedUser.gender,
                    address: updatedUser.address,
                    id_card_photo: updatedUser.id_card_photo,
                    updated_at: updatedUser.updated_at
                },
                profile: {
                    birth_date: updatedProfile.birth_date,
                    phone_number: updatedProfile.phone_number,
                    profile_photo: updatedProfile.profile_photo,
                    updated_at: updatedProfile.updated_at
                }
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Update user & profile error:', error);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'An unexpected error occurred during update',
            errorCode: 'SERVER_ERROR'
        });
    }
};

// const updateProfile = async (req, res) => {
//     try {
//         const userId = req.user?.user_id;
//         const { birth_date, profile_photo, phone_number } = req.body;

//         if (!birth_date && !phone_number && !profile_photo) {
//             return res.status(400).json({
//                 status: 'error',
//                 statusCode: 400,
//                 message: 'At least one field is required',
//                 errorCode: 'INVALID_INPUT'
//             });
//         }

//         const profile = await UserProfile.findOne({ where: { user_id: userId } });

//         if (!profile) {
//             return res.status(404).json({
//                 status: 'error',
//                 statusCode: 404,
//                 message: 'Profile not found',
//                 errorCode: 'PROFILE_NOT_FOUND'
//             });
//         }

//         const updateData = {};
//         if (birth_date !== undefined) updateData.birth_date = birth_date || null;
//         if (phone_number !== undefined) updateData.phone_number = phone_number || null;
//         if (profile_photo !== undefined) updateData.profile_photo = profile_photo || null;

//         await UserProfile.update(updateData, {
//             where: { user_id: userId }
//         });

//         // Fetch updated profile
//         const updatedProfile = await UserProfile.findOne({ where: { user_id: userId } });

//         // console.log('Profile updated:', JSON.stringify(updatedProfile, null, 2));

//         return res.status(200).json({
//             status: 'success',
//             statusCode: 200,
//             message: 'Profile updated successfully',
//             data: {
//                 birth_date: updatedProfile.birth_date,
//                 phone_number: updatedProfile.phone_number,
//                 profile_photo: updatedProfile.profile_photo,
//             }
//         });
//     } catch (error) {
//         console.error('Update profile error:', error);
//         return res.status(500).json({
//             status: 'error',
//             statusCode: 500,
//             message: 'An unexpected error occurred during update profile',
//             errorCode: 'SERVER_ERROR'
//         });
//     }
// };

module.exports = {
    signup,
    login,
    getProfile,
    // updateProfile,
    updateUserData
};