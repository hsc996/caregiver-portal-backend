const { GetHandoverNotesByDate } = require('../services/handoverService');
const { AppError } = require('../functions/helperFunctions');

async function getHandoverNotesController(req, res, next) {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new AppError('date query param required in YYYY-MM-DD format.', 400);
        }

        const notes = await GetHandoverNotesByDate(id, date);
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        next(error);
    }
}

module.exports = { getHandoverNotesController };
