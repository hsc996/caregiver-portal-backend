const mongoose = require("mongoose");

// This schema is for admisitrative record purposes only.

const medicationSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    medicationName: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
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
        required: true,
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
medicationSchema.index({ redBy: 1, actualAdministrationTime: -1 });

const MedicationModel = mongoose.model('Medications', medicationSchema);

module.exports = {
    MedicationModel
}