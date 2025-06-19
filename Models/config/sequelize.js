require('dotenv').config();
const { Sequelize } = require('sequelize');

// Check for required environment variables
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME'];
const missing = requiredEnvVars.filter(name => !process.env[name]);
if (missing.length > 0) throw new Error(`Missing ENV: ${missing.join(', ')}`);

const username = encodeURIComponent(process.env.DB_USER);
const password = encodeURIComponent(process.env.DB_PASSWORD);

const dbURL = `postgres://${username}:${password}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const sequelize = new Sequelize(dbURL, {
    dialect: 'postgres',
    timezone: '+07:00',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }

    // Uncomment if using SSL:
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }
});

module.exports = sequelize;
