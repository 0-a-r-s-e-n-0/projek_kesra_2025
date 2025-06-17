const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Check for required environment variables
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Construct DATABASE_URL
const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const databaseUrl = `postgres://${username}:${password}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Initialize Sequelize
const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: true, // Set to false in production // show log
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    // Uncomment if using SSL:
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }
});

// Database object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.Admin = require('./adminModel')(sequelize, DataTypes);
db.User = require('./userModel')(sequelize, DataTypes);
db.UserProfile = require('./userProfileModel')(sequelize, DataTypes);
db.IncomingMail = require('./incomingMailModel')(sequelize, DataTypes);
db.OutgoingMail = require('./outgoingMailModel')(sequelize, DataTypes);

// Define associations

// User → Admin (verifier)
db.User.belongsTo(db.Admin, {
    foreignKey: 'verified_by_admin_id',
    as: 'verifier',
    onDelete: 'SET NULL'
});
db.Admin.hasMany(db.User, {
    foreignKey: 'verified_by_admin_id',
    as: 'verifiedUsers'
});

// User → UserProfile (1:1)
db.User.hasOne(db.UserProfile, {
    foreignKey: 'user_id',
    as: 'profile',
    onDelete: 'CASCADE'
});
db.UserProfile.belongsTo(db.User, {
    foreignKey: 'user_id',
    as: 'user'
});

// IncomingMail → Admin(Input) 
db.IncomingMail.belongsTo(db.Admin, {
    foreignKey: 'input_by_admin_id',
    as: 'inputBy'
});
db.Admin.hasMany(db.IncomingMail, {
    foreignKey: 'input_by_admin_id',
    as: 'incomingMails'
});


// OutgoingMail → Admin(Input)
db.OutgoingMail.belongsTo(db.Admin, {
    foreignKey: 'input_by_admin_id',
    as: 'inputBy'
});
db.Admin.hasMany(db.OutgoingMail, {
    foreignKey: 'input_by_admin_id',
    as: 'outgoingMails'
});

// Authenticate and sync
async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected to kesra_gubsu');

        await sequelize.sync({ force: false }); // force: true = DROP and RECREATE tables
        console.log('✅ Database synchronized');
    } catch (err) {
        console.error('❌ Failed to connect to the database:', err);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Initialize database
initializeDatabase();

module.exports = db;
