const express = require('express')
const userController = require('../Controllers/userController')

const userAuth = require('../Middlewares/userAuth')
const { validateRegister, validateLogin, validateUpdateUserData } = require('../Middlewares/validations/validate');
const router = express.Router()

const withFileCleanup = require('../helpers/withFileCleanUPHelper');
const createUploader = require('../Middlewares/multerConfig');

// ✅ Konfigurasi upload KTP (id_card)
const uploadUserFiles = createUploader({
    fields: [
        {
            folderName: 'id_card',
            allowedTypes: ['image/jpeg', 'image/png'],
            maxSizeMB: 5,
            fieldName: 'id_card_photo'
        },
        {
            folderName: 'profile_photo',
            allowedTypes: ['image/jpeg', 'image/png'],
            maxSizeMB: 3,
            fieldName: 'profile_photo'
        }
    ]
});

const uploadIdCardOnly = createUploader({
    fields: [
        {
            folderName: 'id_card',
            allowedTypes: ['image/jpeg', 'image/png'],
            maxSizeMB: 5,
            fieldName: 'id_card_photo'
        }
    ]
});

router.post(
    '/signup',
    uploadIdCardOnly,
    userAuth.saveUser,
    withFileCleanup(validateRegister),
    userController.signup
);
router.post('/login', validateLogin, userController.login)
router.get('/profile', userAuth.userAuth, userController.getProfile);
router.patch(
    '/profile',
    uploadUserFiles,
    userAuth.userAuth,
    withFileCleanup(validateUpdateUserData),
    userController.updateUserData
);

module.exports = router