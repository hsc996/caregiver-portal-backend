const mongoose = require("mongoose");

// Administrative record of each medication administration event.

const medicationSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    medicationName: {
        type: String,
        required: true,
        trim: true
    },
    dosage: {
        type: String,
        required: true,
        trim: true
    },
    route: {
        type: String,
        required: true,
        enum: ['Oral', 'Topical', 'Injection', 'Sublingual', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Rectal', 'Transdermal', 'Inhaled', 'Ophthalmic', 'Otic']
    },
    scheduledTime: {
        type: String,
        required: true
    },
    actualAdministrationTime: {
        type: Date,
        default: Date.now
    },
    administeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['given', 'refused', 'missed', 'held'],
        required: true
    },
    refusalReason: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    witnessedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

medicationSchema.index({ patientId: 1, actualAdministrationTime: -1 });
medicationSchema.index({ administeredBy: 1, actualAdministrationTime: -1 });

const MedicationModel = mongoose.model('Medications', medicationSchema);

module.exports = { MedicationModel };
