const { ShiftModel } = require('../models/shiftModel');

const SHIFT_LABELS = {
    morning: 'Morning Care',
    afternoon: 'Afternoon Care',
    evening: 'Evening Care',
    night: 'Night Care',
};

function formatTime(time24) {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function toDateKey(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function GetShiftsByPatient(patientId, year, month) {
    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month, 1);

    const shifts = await ShiftModel
        .find({ patientId, date: { $gte: start, $lt: end } })
        .populate('caregiverId', 'firstName lastName')
        .sort({ date: 1, scheduledStart: 1 });

    const grouped = {};
    for (const shift of shifts) {
        const key = toDateKey(shift.date);
        if (!grouped[key]) grouped[key] = [];
        const cg = shift.caregiverId;
        grouped[key].push({
            id: shift._id,
            caregiver: cg ? [cg.firstName, cg.lastName].filter(Boolean).join(' ') || 'Unknown' : 'Unknown',
            time: `${formatTime(shift.scheduledStart)} – ${formatTime(shift.scheduledEnd)}`,
            type: SHIFT_LABELS[shift.shiftType] ?? shift.shiftType,
            status: shift.status,
        });
    }
    return grouped;
}

module.exports = { GetShiftsByPatient };
