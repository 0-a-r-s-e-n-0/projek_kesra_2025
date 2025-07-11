const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SuperAdmin = sequelize.define(
        'SuperAdmin',
        {
            super_admin_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            username: { type: DataTypes.STRING(255), allowNull: false, unique: true },
            email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
            password_hash: { type: DataTypes.TEXT, allowNull: false },
            full_name: { type: DataTypes.STRING(255), allowNull: false },
            phone_number: { type: DataTypes.STRING(20), allowNull: false, unique: true },
        },
        {
            tableName: 'super_admin',
            underscored: true,
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    return SuperAdmin;
};
