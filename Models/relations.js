module.exports = (db) => {
    db.User.belongsTo(db.Admin, {
        foreignKey: 'verified_by_admin_id',
        as: 'verifier',
        onDelete: 'SET NULL'
    });
    db.Admin.hasMany(db.User, {
        foreignKey: 'verified_by_admin_id',
        as: 'verifiedUsers'
    });

    db.User.hasOne(db.UserProfile, {
        foreignKey: 'user_id',
        as: 'profile',
        onDelete: 'CASCADE'
    });
    db.UserProfile.belongsTo(db.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    db.IncomingMail.belongsTo(db.Admin, {
        foreignKey: 'input_by_admin_id',
        as: 'inputBy'
    });
    db.Admin.hasMany(db.IncomingMail, {
        foreignKey: 'input_by_admin_id',
        as: 'incomingMails'
    });

    db.OutgoingMail.belongsTo(db.Admin, {
        foreignKey: 'input_by_admin_id',
        as: 'inputBy'
    });
    db.Admin.hasMany(db.OutgoingMail, {
        foreignKey: 'input_by_admin_id',
        as: 'outgoingMails'
    });
};
