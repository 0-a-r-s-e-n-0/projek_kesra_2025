const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Admin = sequelize.define('Admin', {
        admin_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                isIn: [['Pria', 'Wanita']]
            }
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        nip: {
            type: DataTypes.STRING(25),
            allowNull: false,
            unique: true
        },
        positions: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        suspend: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }

    }, {
        tableName: 'admins',
        timestamps: true,
        underscored: true, //  snake_case 
        updatedAt: 'updated_at',
    });

    return Admin;
};
