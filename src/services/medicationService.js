const { MedicationModel } = require('../models/medicationModel');
const { AppError } = require('../functions/helperFunctions');

async function CreateMedicationAdministration(patientId, { medicationName, dosage, route, scheduledTime }, userId) {
    if (!medicationName || !dosage || !route || !scheduledTime) {
        throw new AppError('Missing required medication fields.', 400);
    }

    const record = await MedicationModel.create({
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

async function GetMedicationAdministrations(patientId, date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return MedicationModel.find({
        patientId,
        actualAdministrationTime: { $gte: start, $lte: end },
    }).populate('administeredBy', 'firstName lastName');
}

module.exports = { CreateMedicationAdministration, GetMedicationAdministrations };
