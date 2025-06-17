//importing modules
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");
const { DateTime } = require('luxon');
require('dotenv').config();

const User = db.User;
const UserProfile = db.UserProfile;

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
    const transaction = await db.sequelize.transaction(); // Start transaction
    try {

        const { username, email, password, nik, full_name, gender, address, id_card_photo } = req.body;

        // if (!password) {
        //     await transaction.rollback();
        //     return res.status(400).json({
        //         status: 'error',
        //         statusCode: 400,
        //         message: 'Password are required',
        //         errorCode: 'INVALID_INPUT'
        //     });
        // }

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

        //saving the user
        const user = await User.create(data, { transaction });

        //if user details is captured
        if (user) {
            // Create user profile
            await UserProfile.create({
                user_id: user.user_id,
            }, { transaction });

            // Commit transaction
            await transaction.commit();

            // console.log('User register:', JSON.stringify(user, null, 2));
            // console.log('UserProfile created:', JSON.stringify(userProfile, null, 2));

            //send users details
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
        console.error('Signup error:', error);
        await transaction.rollback();
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'An unexpected error occurred during register',
            errorCode: 'SERVER_ERROR'
        });
    }
};


//login authentication

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

        //find a user by their email
        const user = await User.findOne({
            where: {
                email: email
            }

        });

        //if user email is found, compare password with bcrypt
        if (user) {
            const isSame = await bcrypt.compare(password, user.password_hash);

            //if password is the same
            //generate token with the user's id and the secretKey in the env file
            if (isSame) {
                const payload = {
                    id: user.user_id,        // user ID, konvensi umum pakai "sub" (subject)
                };
                let token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });

                const register_at = DateTime.fromJSDate(user.register_at)
                    .setZone('Asia/Jakarta')
                    .toFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZZ");

                //if password matches wit the one in the database
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

                if (!user.is_verified) {
                    return res.status(403).json({
                        status: 'error',
                        statusCode: 403,
                        message: 'Your account has not been verified by an admin yet',
                        errorCode: 'USER_NOT_VERIFIED'
                    });
                }

                //send users details
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

        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'User not authenticated',
                data: null
            });
        }

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

const updateProfile = async (req, res) => {
    try {
        console.log('req.user:', req.user);
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(401).json({
                status: 'error',
                message: 'User not authenticated',
                data: null
            });
        }

        const { full_name, phone_number, address } = req.body;

        // Validate input
        if (!full_name && !phone_number && !address) {
            return res.status(400).json({
                status: 'error',
                message: 'At least one field (full_name, phone_number, address) is required',
                data: null
            });
        }

        // Find profile
        console.log('Finding profile for user_id:', userId);
        const profile = await UserProfile.findOne({ where: { user_id: userId } });
        if (!profile) {
            return res.status(404).json({
                status: 'error',
                message: 'Profile not found',
                data: null
            });
        }

        // Prepare update data
        const updateData = {};
        if (full_name !== undefined) updateData.full_name = full_name || null;
        if (phone_number !== undefined) updateData.phone_number = phone_number || null;
        if (address !== undefined) updateData.address = address || null;

        // Update profile
        console.log('Updating profile with:', updateData);
        await UserProfile.update(updateData, {
            where: { user_id: userId }
        });

        // Fetch updated profile
        const updatedProfile = await UserProfile.findOne({ where: { user_id: userId } });

        console.log('Profile updated:', JSON.stringify(updatedProfile, null, 2));

        const register_at = DateTime.fromJSDate(updatedProfile.created_at)
            .setZone('Asia/Jakarta')
            .toFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZZ");

        return res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                birth_date: updateProfile.birth_date,
                phone_number: updatedProfile.phone_number,
                profile_photo: updatedProfile.profile_photo,
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error',
            data: null
        });
    }
};

module.exports = {
    signup,
    login,
    getProfile,
    updateProfile,
};