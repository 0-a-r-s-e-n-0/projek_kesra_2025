const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./config/sequelize');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.Admin = require('./adminModel')(sequelize, DataTypes);
db.User = require('./userModel')(sequelize, DataTypes);
db.UserProfile = require('./userProfileModel')(sequelize, DataTypes);
db.IncomingMail = require('./incomingMailModel')(sequelize, DataTypes);
db.OutgoingMail = require('./outgoingMailModel')(sequelize, DataTypes);

// Hubungkan relasi setelah model dimuat
require('./relations')(db);

module.exports = db;
