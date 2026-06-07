const { GetAllPatients, GetPatientById, UpdatePatientById } = require('../services/patientService');
const { AppError } = require('../functions/helperFunctions');


async function getAllPatientsController(req, res, next) {
    try {
        const patients = await GetAllPatients(req.user.companyId);
        res.status(200).json({ success: true, data: patients });
    } catch (error) {
        next(error);
    }
}

async function getPatientController(req, res, next) {
    try {
        const { id } = req.params;
        const patient = await GetPatientById(id, req.user.companyId);
        res.status(200).json({ success: true, data: patient });
    } catch (error) {
        next(error);
    }
}

async function updatePatientController(req, res, next) {
    try {
        const { id } = req.params;
        const allowed = ['firstName', 'lastName', 'dateOfBirth', 'allergies', 'alerts', 'emergencyContacts'];
        const data = {};
        allowed.forEach(field => {
            if (req.body[field] !== undefined) data[field] = req.body[field];
        });
        const patient = await UpdatePatientById(id, data, req.user.companyId);
        res.status(200).json({ success: true, data: patient, message: 'Patient updated successfully.' });
    } catch (error) {
        next(error);
    }
}

async function uploadPatientImageController(req, res, next) {
    try {
        if (!req.file) throw new AppError('No image file provided', 400);
        const { id } = req.params;
        const patient = await UpdatePatientById(id, { profileImg: req.file.path }, req.user.companyId);
        res.status(200).json({ success: true, data: patient, message: 'Profile image updated successfully.' });
    } catch (error) {
        next(error);
    }
}

module.exports = { getAllPatientsController, getPatientController, updatePatientController, uploadPatientImageController };
