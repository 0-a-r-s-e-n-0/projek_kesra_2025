const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./config/sequelize');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.SuperAdmin = require('./superAdmin')(sequelize, DataTypes);
db.Admin = require('./adminModel')(sequelize, DataTypes);
db.User = require('./userModel')(sequelize, DataTypes);
db.UserProfile = require('./userProfileModel')(sequelize, DataTypes);
db.IncomingMail = require('./incomingMailModel')(sequelize, DataTypes);
db.OutgoingMail = require('./outgoingMailModel')(sequelize, DataTypes);
db.Province = require('./provinceModel')(sequelize, DataTypes);
db.Regency = require('./regenciesModel')(sequelize, DataTypes);
db.BeasiswaDetail = require('./beasiswaDetailModel')(sequelize, DataTypes);
db.HibahDetail = require('./hibahDetailModel')(sequelize, DataTypes);
db.HibahSubCategory = require('./hibahSubCategoryModel')(sequelize, DataTypes);
db.Attachment = require('./lampiranModel')(sequelize, DataTypes);
db.Proposal = require('./proposalModel')(sequelize, DataTypes);
db.ProposalType = require('./proposalTypeModel')(sequelize, DataTypes);
db.AcademicLevel = require('./academikLevelModel')(sequelize, DataTypes);
db.ProposalProgress = require('./proposalProgressModel')(sequelize, DataTypes);

// Hubungkan relasi setelah model dimuat
require('./relations')(db);

module.exports = db;
