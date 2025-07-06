const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define(
        'User',
        {
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            username: { type: DataTypes.STRING(255), allowNull: false, unique: true },
            email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
            password_hash: { type: DataTypes.TEXT, allowNull: false },
            nik: { type: DataTypes.STRING(35), allowNull: false, unique: true },
            full_name: { type: DataTypes.STRING(255), allowNull: false },
            gender: {
                type: DataTypes.STRING(20),
                allowNull: false,
                validate: { isIn: [['Pria', 'Wanita']] },
            },
            address: { type: DataTypes.TEXT, allowNull: false },
            id_card_photo: { type: DataTypes.TEXT, allowNull: false },
            is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
            verified_at: { type: DataTypes.DATE },
            verified_by_admin_id: { type: DataTypes.UUID },
            suspend: { type: DataTypes.BOOLEAN, defaultValue: false },
        },
        {
            tableName: 'users',
            underscored: true,
            freezeTableName: true,
            timestamps: true,
            createdAt: 'register_at',
            updatedAt: 'updated_at',
        }
    );

    return User;
};
