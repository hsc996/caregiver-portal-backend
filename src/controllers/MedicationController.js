const { CreateMedicationAdministration, GetMedicationAdministrations } = require('../services/medicationService');
const { AppError } = require('../functions/helperFunctions');

async function createMedicationAdministrationController(req, res, next) {
    try {
        const { id: patientId } = req.params;
        const record = await CreateMedicationAdministration(patientId, req.body, req.user.id);
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
        const records = await GetMedicationAdministrations(patientId, date);
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        next(error);
    }
}

module.exports = { createMedicationAdministrationController, getMedicationAdministrationsController };
