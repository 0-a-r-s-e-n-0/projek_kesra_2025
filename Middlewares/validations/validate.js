const validateRegister = require('./user/registerValidator');
const validateLogin = require('./user/loginValidator');
const validateUpdateUserData = require('./user/updateUserDataValidator');
const validateAdminLogin = require('./admin/loginValidator');

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateUserData,
    validateAdminLogin,
};
