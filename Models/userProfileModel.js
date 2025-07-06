const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserProfile = sequelize.define(
        'UserProfile',
        {
            profile_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: { type: DataTypes.UUID, allowNull: false, unique: true },
            birth_date: DataTypes.DATEONLY,
            phone_number: DataTypes.STRING(20),
            profile_photo: DataTypes.TEXT,
            last_login: DataTypes.DATE,
        },
        {
            tableName: 'user_profiles',
            underscored: true,
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    return UserProfile;
};
