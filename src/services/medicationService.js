const { MedicationModel } = require('../models/medicationModel');
const { AppError } = require('../functions/helperFunctions');

async function CreateMedicationAdministration(patientId, { medicationName, dosage, route, scheduledTime }, userId, companyId) {
    if (!medicationName || !dosage || !route || !scheduledTime) {
        throw new AppError('Missing required medication fields.', 400);
    }

    const record = await MedicationModel.create({
        companyId,
        patientId,
        medicationName,
        dosage,
        route,
        scheduledTime,
        administeredBy: userId,
        status: 'given',
        actualAdministrationTime: new Date(),
    });

    await record.populate('administeredBy', 'firstName lastName username');

    return record;
}

async function GetMedicationAdministrations(patientId, companyId, date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return MedicationModel.find({
        patientId,
        companyId,
        status: 'given',
        actualAdministrationTime: { $gte: start, $lte: end },
    }).populate('administeredBy', 'firstName lastName');
}

async function UnvalidateMedicationAdministration(recordId, userId, reason, companyId) {
    if (!reason || !reason.trim()) {
        throw new AppError('A reason is required to unvalidate a medication record.', 400);
    }

    const record = await MedicationModel.findById(recordId);
    if (!record) throw new AppError('Medication administration record not found.', 404);
    if (record.companyId.toString() !== companyId.toString()) {
        throw new AppError('Medication administration record not found.', 404);
    }
    if (record.status !== 'given') throw new AppError('Only administered medications can be unvalidated.', 400);
    if (record.administeredBy.toString() !== userId.toString()) {
        throw new AppError('Unauthorized. This medication was validated by another user.', 403);
    }

    record.status = 'unvalidated';
    record.unvalidatedAt = new Date();
    record.unvalidatedBy = userId;
    record.unvalidationReason = reason.trim();
    await record.save();

    await record.populate('unvalidatedBy', 'firstName lastName username');
    return record;
}

module.exports = { CreateMedicationAdministration, GetMedicationAdministrations, UnvalidateMedicationAdministration };
