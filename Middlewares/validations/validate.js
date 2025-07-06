const validateRegister = require('./user/registerValidator');
const validateLogin = require('./user/loginValidator');
const validateUpdateUserData = require('./user/updateUserDataValidator');
const validateAdminLogin = require('./admin/loginValidator');
const validateBeasiswaProposal = require('./proposal/validateBeasiswaProposal');
const validateHibahProposal = require('./proposal/validateHibahProposal');

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateUserData,
    validateAdminLogin,
    validateBeasiswaProposal,
    validateHibahProposal
};
