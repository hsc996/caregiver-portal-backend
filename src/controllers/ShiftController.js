const { GetShiftsByPatient } = require('../services/shiftService');
const { requireCaregiverAccess } = require('../services/patientService');

async function getPatientShiftsController(req, res, next) {
    try {
        const { id } = req.params;
        const { month } = req.query; // expects "YYYY-MM"

        await requireCaregiverAccess(id, req.user.id, req.user.role);

        let year, mon;
        if (month && /^\d{4}-\d{2}$/.test(month)) {
            [year, mon] = month.split('-').map(Number);
        } else {
            const now = new Date();
            year = now.getFullYear();
            mon  = now.getMonth() + 1;
        }

        const data = await GetShiftsByPatient(id, year, mon);
        res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
}

module.exports = { getPatientShiftsController };
