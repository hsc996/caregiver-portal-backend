const { PatientModel } = require('../models/patientModel');
const { AppError } = require('../functions/helperFunctions');


async function GetAllPatients(userId) {
    return PatientModel
        .find({ isActive: true, 'caregivers.userId': userId })
        .sort({ lastName: 1, firstName: 1 });
}

async function GetPatientById(id) {
    const patient = await PatientModel.findById(id);
    if (!patient || !patient.isActive) throw new AppError('Patient not found', 404);
    return patient;
}

async function UpdatePatientById(id, data) {
    const patient = await PatientModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    );
    if (!patient) throw new AppError('Patient not found', 404);
    return patient;
}

module.exports = { GetAllPatients, GetPatientById, UpdatePatientById };
