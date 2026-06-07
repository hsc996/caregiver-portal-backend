const { CreateMedicationAdministration, GetMedicationAdministrations, UnvalidateMedicationAdministration } = require('../services/medicationService');
const { requireCompanyPatient } = require('../services/patientService');
const { AppError } = require('../functions/helperFunctions');

async function createMedicationAdministrationController(req, res, next) {
    try {
        const { id: patientId } = req.params;
        await requireCompanyPatient(patientId, req.user.companyId);
        const record = await CreateMedicationAdministration(patientId, req.body, req.user.id, req.user.companyId);
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
}

async function getMedicationAdministrationsController(req, res, next) {
    try {
        const { id: patientId } = req.params;
        const { date } = req.query;
        if (!date) throw new AppError('date query param is required.', 400);
        await requireCompanyPatient(patientId, req.user.companyId);
        const records = await GetMedicationAdministrations(patientId, date);
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        next(error);
    }
}

async function unvalidateMedicationAdministrationController(req, res, next) {
    try {
        const { recordId } = req.params;
        const { reason } = req.body;
        if (!reason) throw new AppError('reason is required.', 400);
        const record = await UnvalidateMedicationAdministration(recordId, req.user.id, reason);
        res.status(200).json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
}

module.exports = { createMedicationAdministrationController, getMedicationAdministrationsController, unvalidateMedicationAdministrationController };
