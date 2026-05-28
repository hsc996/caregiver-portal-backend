const { GetHandoverNotesByDate } = require('../services/handoverService');
const { AppError } = require('../functions/helperFunctions');
const { requireCaregiverAccess } = require('../services/patientService');

async function getHandoverNotesController(req, res, next) {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new AppError('date query param required in YYYY-MM-DD format.', 400);
        }

        const [y, m, d] = date.split('-').map(Number);
        const parsed = new Date(y, m - 1, d);
        if (parsed.getFullYear() !== y || parsed.getMonth() !== m - 1 || parsed.getDate() !== d) {
            throw new AppError('Invalid date value.', 400);
        }

        await requireCaregiverAccess(id, req.user.id, req.user.role);

        const notes = await GetHandoverNotesByDate(id, date);
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        next(error);
    }
}

module.exports = { getHandoverNotesController };
