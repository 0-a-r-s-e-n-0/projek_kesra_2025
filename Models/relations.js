module.exports = (db) => {
    /* 1. Provinsi – Kabupaten/Kota */
    db.Province.hasMany(db.Regency, { foreignKey: 'province_id', as: 'regencies', onDelete: 'CASCADE' });
    db.Regency.belongsTo(db.Province, { foreignKey: 'province_id', as: 'province', onDelete: 'CASCADE' });

    /* 2. Admin – User (verifikasi) */
    db.User.belongsTo(db.Admin, { foreignKey: 'verified_by_admin_id', as: 'verifier', onDelete: 'SET NULL' });
    db.Admin.hasMany(db.User, { foreignKey: 'verified_by_admin_id', as: 'verifiedUsers' });

    /* 3. User – UserProfile */
    db.User.hasOne(db.UserProfile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE' });
    db.UserProfile.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

    /* 4. Admin – Incoming / Outgoing mail */
    db.IncomingMail.belongsTo(db.Admin, { foreignKey: 'input_by_admin_id', as: 'inputBy' });
    db.OutgoingMail.belongsTo(db.Admin, { foreignKey: 'input_by_admin_id', as: 'inputBy' });
    db.Admin.hasMany(db.IncomingMail, { foreignKey: 'input_by_admin_id', as: 'incomingMails' });
    db.Admin.hasMany(db.OutgoingMail, { foreignKey: 'input_by_admin_id', as: 'outgoingMails' });

    /* 5. Proposal ↔ Tipe / Kabupaten / User */
    db.Proposal.belongsTo(db.ProposalType, { foreignKey: 'type_id', as: 'type' });
    db.ProposalType.hasMany(db.Proposal, { foreignKey: 'type_id', as: 'proposals' });

    db.Proposal.belongsTo(db.Regency, { foreignKey: 'regencies_id', as: 'regency' });

    db.Proposal.belongsTo(db.User, { foreignKey: 'input_by', as: 'inputBy' });
    db.User.hasMany(db.Proposal, { foreignKey: 'input_by', as: 'inputtedProposals' });

    /* 6. HibahDetail & BeasiswaDetail */
    db.Proposal.hasOne(db.HibahDetail, { foreignKey: 'proposal_id', as: 'hibah_detail', onDelete: 'CASCADE' });
    db.HibahDetail.belongsTo(db.Proposal, { foreignKey: 'proposal_id', as: 'proposal' });

    db.Proposal.hasOne(db.BeasiswaDetail, {
        foreignKey: 'proposal_id',
        as: 'beasiswa_detail',
        onDelete: 'CASCADE',
    });
    db.BeasiswaDetail.belongsTo(db.Proposal, { foreignKey: 'proposal_id', as: 'proposal' });

    /* 7. HibahDetail ↔ SubCategory */
    db.HibahDetail.belongsTo(db.HibahSubCategory, { foreignKey: 'sub_id', as: 'sub_category' });
    db.HibahSubCategory.hasMany(db.HibahDetail, { foreignKey: 'sub_id', as: 'hibah_details' });

    /* 8. SubCategory ↔ ProposalType (FK nullable) */
    db.HibahSubCategory.belongsTo(db.ProposalType, { foreignKey: 'type_id', as: 'type' });
    db.ProposalType.hasMany(db.HibahSubCategory, { foreignKey: 'type_id', as: 'hibah_sub_categories' });

    /* 9. BeasiswaDetail ↔ AcademicLevel */
    db.BeasiswaDetail.belongsTo(db.AcademicLevel, { foreignKey: 'academic_level', as: 'level' });
    db.AcademicLevel.hasMany(db.BeasiswaDetail, { foreignKey: 'academic_level', as: 'beasiswa_details' });

    /* 10. Proposal – Attachments */
    db.Proposal.hasMany(db.Attachment, { foreignKey: 'proposal_id', as: 'attachments', onDelete: 'CASCADE' });
    db.Attachment.belongsTo(db.Proposal, { foreignKey: 'proposal_id', as: 'proposal' });

};
