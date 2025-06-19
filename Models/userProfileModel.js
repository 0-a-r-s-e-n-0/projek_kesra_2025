const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserProfile = sequelize.define('UserProfile', {
        profile_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE'
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        profile_photo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'user_profiles',
        timestamps: true,              // ✅ otomatis handle created_at & updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true
    });

    return UserProfile;
};
