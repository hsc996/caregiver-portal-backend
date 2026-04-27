const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    shiftType: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'night'],
        required: true
    },
    scheduledStart: {
        type: String,
        required: true,
        match: [/^\d{2}:\d{2}$/, 'scheduledStart must be in HH:MM format']
    },
    scheduledEnd: {
        type: String,
        required: true,
        match: [/^\d{2}:\d{2}$/, 'scheduledEnd must be in HH:MM format']
    },
    actualClockIn:  Date,
    actualClockOut: Date,
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
        default: 'scheduled'
    },
    notes: {
        type: String,
        trim: true,
        default: null
    }
}, { timestamps: true });

shiftSchema.index({ patientId: 1, date: -1 });
shiftSchema.index({ caregiverId: 1, date: -1 });

const ShiftModel = mongoose.model('Shift', shiftSchema);

module.exports = { ShiftModel };
