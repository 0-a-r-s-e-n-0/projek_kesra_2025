const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Province = sequelize.define(
        'Province',
        {
            provinces_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            named: {
                type: DataTypes.STRING(100),
                unique: true,
                allowNull: false,
            },
        },
        {
            tableName: 'provinces',
            timestamps: false,
            freezeTableName: true,
        }
    );

    return Province;
};
