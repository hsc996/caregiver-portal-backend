const express = require('express');
const router = express.Router();
const { CompanyModel } = require('../models/companyModel');
const { authenticateUser, authorizeRoles } = require('../utils/middleware');
const { AppError } = require('../functions/helperFunctions');

// GET /company/invite — return current invite code (Admin only)
router.get('/invite', authenticateUser, authorizeRoles('Admin'), async (req, res, next) => {
    try {
        const company = await CompanyModel.findById(req.user.companyId, 'name inviteCode');
        if (!company) throw new AppError('Company not found.', 404);
        res.status(200).json({ success: true, data: { name: company.name, inviteCode: company.inviteCode } });
    } catch (error) {
        next(error);
    }
});

// POST /company/invite/regenerate — generate a new invite code (Admin only)
router.post('/invite/regenerate', authenticateUser, authorizeRoles('Admin'), async (req, res, next) => {
    try {
        const company = await CompanyModel.findById(req.user.companyId);
        if (!company) throw new AppError('Company not found.', 404);
        await company.regenerateInviteCode();
        res.status(200).json({ success: true, data: { inviteCode: company.inviteCode } });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
