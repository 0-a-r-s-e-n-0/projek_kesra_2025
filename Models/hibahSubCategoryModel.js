const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'HibahSubCategory',
        {
            sub_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            type_id: DataTypes.INTEGER,
            named: { type: DataTypes.TEXT, allowNull: false },
        },
        { tableName: 'hibah_sub_categories', timestamps: false, freezeTableName: true }
    );
};