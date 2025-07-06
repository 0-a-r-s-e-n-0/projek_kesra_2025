const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'AcademicLevel',
        {
            lev_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            description: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        },
        { tableName: 'academic_levels', timestamps: false, freezeTableName: true }
    );
};