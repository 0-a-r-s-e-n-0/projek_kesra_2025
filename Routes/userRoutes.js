//importing modules
const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login, updateProfile } = userController
const userValidate = require('../Middleware/validateUserInput')
const userAuth = require('../Middleware/userAuth')
const { body, validationResult } = require('express-validator');

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userValidate, userAuth.saveUser, signup)

//login route
router.post('/login', login)

router.get('/profiles', userAuth.userAuth, userController.getProfile);

router.patch('/profile', [
    body('full_name').optional().isString(),
    body('phone_number').optional().isString().matches(/^\+?[1-9]\d{1,14}$/),
    body('address').optional().isString()
], userAuth.userAuth, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            data: errors.array()
        });
    }
    next();
}, updateProfile);

module.exports = router