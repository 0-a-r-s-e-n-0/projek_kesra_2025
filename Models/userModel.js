const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
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
        nik: {
            type: DataTypes.STRING(35),
            allowNull: false,
            unique: true
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
        address: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        id_card_photo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        verified_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        verified_by_admin_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'admins',
                key: 'admin_id'
            },
            onDelete: 'SET NULL'
        },
        suspend: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        register_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'users',
        timestamps: false // Karena kamu pakai created_at / updated_at manual
    });

    return User;
};
