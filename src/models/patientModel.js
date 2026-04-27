const mongoose = require("mongoose");
const { emergencyContactSchema } = require('./emergencyContactSchema');

const caregiverSubSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'viewer'],
        default: 'viewer'
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const medicationScheduleSubSchema = new mongoose.Schema({
    name:           { type: String, required: [true, 'Medication name is required'], trim: true },
    dosage:         { type: String, required: [true, 'Dosage is required'],          trim: true },
    route:          { type: String, required: [true, 'Route is required'],           trim: true },
    frequency:      { type: String, trim: true },
    scheduledTimes: [String],
    prescribedBy:   { type: String, trim: true },
    startDate:      Date,
    endDate:        Date,
    isActive:       { type: Boolean, default: true }
}, { _id: false });

const careTaskSubSchema = new mongoose.Schema({
    task:         { type: String, required: [true, 'Task description is required'], trim: true },
    frequency:    { type: String, trim: true },
    category:     { type: String, trim: true },
    instructions: { type: String, trim: true }
}, { _id: false });

const patientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    profileImg: {
        type: String,
        default: null
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    allergies: [{ type: String, trim: true }],
    alerts:    [{ type: String, trim: true }],
    emergencyContacts: {
        type: [emergencyContactSchema],
        validate: {
            validator: (contacts) => contacts.length <= 2,
            message: 'Maximum of 2 emergency contacts allowed'
        }
    },
    caregivers: {
        type: [caregiverSubSchema],
        validate: {
            validator: function (caregivers) {
                const ids = caregivers.map((c) => c.userId.toString());
                return ids.length === new Set(ids).size;
            },
            message: 'A user can only be assigned to a patient once'
        }
    },
    medicationSchedule: [medicationScheduleSubSchema],
    careTaskSchedule:   [careTaskSubSchema],
    isActive:  { type: Boolean, default: true },
    deletedAt: Date
}, {
    timestamps: true
});

patientSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

patientSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null;
    const today     = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

patientSchema.set('toJSON',   { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

patientSchema.index({ isActive: 1, 'caregivers.userId': 1 });
patientSchema.index({ lastName: 1, firstName: 1 });

const PatientModel = mongoose.model('Patient', patientSchema);

module.exports = { PatientModel };
