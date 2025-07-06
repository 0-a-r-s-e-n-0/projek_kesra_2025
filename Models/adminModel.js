const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Admin = sequelize.define(
        'Admin',
        {
            admin_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            username: { type: DataTypes.STRING(255), allowNull: false, unique: true },
            email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
            password_hash: { type: DataTypes.TEXT, allowNull: false },
            full_name: { type: DataTypes.STRING(255), allowNull: false },
            gender: {
                type: DataTypes.STRING(20),
                allowNull: false,
                validate: { isIn: [['Pria', 'Wanita']] },
            },
            phone_number: { type: DataTypes.STRING(20), allowNull: false, unique: true },
            nip: { type: DataTypes.STRING(25), allowNull: false, unique: true },
            positions: { type: DataTypes.STRING(100), allowNull: false },
            address: { type: DataTypes.TEXT, allowNull: false },
            suspend: { type: DataTypes.BOOLEAN, defaultValue: false },
        },
        {
            tableName: 'admins',
            underscored: true,
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    return Admin;
};
