const mongoose = require('mongoose');
const crypto = require('crypto');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxLength: [100, 'Company name must not exceed 100 characters'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    inviteCode: {
        type: String,
        unique: true,
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

companySchema.pre('save', function (next) {
    if (!this.inviteCode) {
        this.inviteCode = crypto.randomBytes(6).toString('hex');
    }
    next();
});

companySchema.methods.regenerateInviteCode = async function () {
    this.inviteCode = crypto.randomBytes(6).toString('hex');
    return this.save();
};

const CompanyModel = mongoose.model('Company', companySchema);

module.exports = { CompanyModel };
