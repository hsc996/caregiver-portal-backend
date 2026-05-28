const { HandoverModel } = require('../models/handoverNotesModel');

async function GetHandoverNotesByDate(patientId, date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const notes = await HandoverModel
        .find({ patientId, createdAt: { $gte: start, $lte: end } })
        .populate('userId', 'firstName lastName')
        .sort({ createdAt: 1 });

    return notes.map((n) => ({
        id: n._id,
        caregiver: n.userId
            ? [n.userId.firstName, n.userId.lastName].filter(Boolean).join(' ') || 'Unknown'
            : 'Unknown',
        submittedAt: n.createdAt,
        title: n.title,
        content: n.content,
        tags: n.tags,
    }));
}

module.exports = { GetHandoverNotesByDate };
