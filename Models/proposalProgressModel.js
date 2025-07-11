const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'ProposalProgress',
        {
            progress_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            description: { type: DataTypes.TEXT, allowNull: false },
        },
        { tableName: 'proposal_progress', timestamps: false, freezeTableName: true }
    );
};