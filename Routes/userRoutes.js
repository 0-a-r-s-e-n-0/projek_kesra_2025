//importing modules
const express = require('express')
const userController = require('../Controllers/userController')
const userValidate = require('../Middleware/validateUserInput')
const userAuth = require('../Middleware/userAuth')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userValidate, userAuth.saveUser, userController.signup)

//login route
router.post('/login', userController.login)

router.get('/profiles', userAuth.userAuth, userController.getProfile);

router.patch('/profile', userAuth.userAuth, userController.updateProfile);

module.exports = router