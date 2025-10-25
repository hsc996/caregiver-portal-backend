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
        type: String,  // "08:00"
        required: true
    },
    scheduledEnd: {
        type: String,
        required: true
    },
    actualClockIn: {
        type: Date
    },
    actualClockOut: {
        type: Date
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
        default: 'scheduled'
    }
}, { timestamps: true });

shiftSchema.index({ patientId: 1, date: -1 });
shiftSchema.index({ caregiverId: 1, date: -1 });

const ShiftModel = mongoose.model('Shift', shiftSchema);

module.exports = {
    ShiftModel
}