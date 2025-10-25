const mongoose = require("mongoose");

const adlRecordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    shift: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'night'],
        required: true
    },
    activities: {
        bathing: {
            completed: { type: Boolean, default: false },
            assistanceLevel: { 
                type: String, 
                enum: ['independent', 'supervision', 'minimal', 'moderate', 'full'],
                default: 'independent'
            },
            time: Date,
            notes: String
        },
        dressing: {
            completed: { type: Boolean, default: false },
            assistanceLevel: { 
                type: String, 
                enum: ['independent', 'supervision', 'minimal', 'moderate', 'full'],
                default: 'independent'
            },
            time: Date,
            notes: String
        },
        toileting: {
            completed: { type: Boolean, default: false },
            assistanceLevel: { 
                type: String, 
                enum: ['independent', 'supervision', 'minimal', 'moderate', 'full'],
                default: 'independent'
            },
            time: Date,
            notes: String
        },
        eating: {
            completed: { type: Boolean, default: false },
            assistanceLevel: { 
                type: String, 
                enum: ['independent', 'supervision', 'minimal', 'moderate', 'full'],
                default: 'independent'
            },
            mealType: String,  // "Breakfast", "Lunch", "Dinner"
            amountConsumed: String,  // "100%", "75%", "50%", etc.
            time: Date,
            notes: String
        },
        mobility: {
            completed: { type: Boolean, default: false },
            assistanceLevel: { 
                type: String, 
                enum: ['independent', 'supervision', 'minimal', 'moderate', 'full'],
                default: 'independent'
            },
            distance: String,
            time: Date,
            notes: String
        },
        positioning: {
            completed: { type: Boolean, default: false },
            time: Date,
            notes: String
        }
    },
    vitalSigns: {
        bloodPressure: {
            systolic: Number,
            diastolic: Number,
            time: Date
        },
        heartRate: {
            value: Number,
            time: Date
        },
        temperature: {
            value: Number,
            unit: { type: String, enum: ['F', 'C'], default: 'F' },
            time: Date
        },
        oxygenSaturation: {
            value: Number,
            time: Date
        },
        bloodGlucose: {
            value: Number,
            time: Date
        }
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

adlRecordSchema.index({ patientId: 1, date: -1, shift: 1 });
adlRecordSchema.index({ recordedBy: 1, date: -1 });

const ADLRecordModel = mongoose.model('ADLRecord', adlRecordSchema);

module.exports = {
    ADLRecordModel
}