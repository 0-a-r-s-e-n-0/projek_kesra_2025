const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'ProposalType',
        {
            type_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            named: { type: DataTypes.TEXT, allowNull: false },
        },
        { tableName: 'proposal_types', timestamps: false, freezeTableName: true }
    );
};