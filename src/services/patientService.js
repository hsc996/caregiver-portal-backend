const { PatientModel } = require('../models/patientModel');
const { AppError } = require('../functions/helperFunctions');


async function GetAllPatients(userId) {
    return PatientModel
        .find({ isActive: true, 'caregivers.userId': userId })
        .sort({ lastName: 1, firstName: 1 });
}

async function requireCaregiverAccess(patientId, userId, userRole) {
    const patient = await PatientModel.findById(patientId);
    if (!patient || !patient.isActive) throw new AppError('Patient not found', 404);
    if (userRole !== 'Admin' && !patient.caregivers.some(c => c.userId.equals(userId))) {
        throw new AppError('Access denied', 403);
    }
    return patient;
}

async function GetPatientById(id, userId, userRole) {
    return requireCaregiverAccess(id, userId, userRole);
}

async function UpdatePatientById(id, data, userId, userRole) {
    await requireCaregiverAccess(id, userId, userRole);
    const patient = await PatientModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    );
    if (!patient) throw new AppError('Patient not found', 404);
    return patient;
}

module.exports = { GetAllPatients, GetPatientById, UpdatePatientById, requireCaregiverAccess };
