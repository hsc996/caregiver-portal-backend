const { PatientModel } = require('../models/patientModel');
const { AppError } = require('../functions/helperFunctions');


async function GetAllPatients(companyId) {
    return PatientModel
        .find({ companyId, isActive: true })
        .sort({ lastName: 1, firstName: 1 });
}

async function requireCompanyPatient(patientId, companyId) {
    const patient = await PatientModel.findOne({ _id: patientId, companyId, isActive: true });
    if (!patient) throw new AppError('Patient not found', 404);
    return patient;
}

async function GetPatientById(id, companyId) {
    return requireCompanyPatient(id, companyId);
}

async function UpdatePatientById(id, data, companyId) {
    await requireCompanyPatient(id, companyId);
    const patient = await PatientModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    );
    if (!patient) throw new AppError('Patient not found', 404);
    return patient;
}

module.exports = { GetAllPatients, GetPatientById, UpdatePatientById, requireCompanyPatient };
