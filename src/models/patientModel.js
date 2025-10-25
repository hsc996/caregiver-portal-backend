const mongoose = require("mongoose");
const { emergencyContactSchema } = require('./emergencyContactModel');

const patientSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.'],
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
    allergies: [{
        type: String,
        trim: true
    }],
    alerts: [{
        type: String,
        trim: true
    }],
    emergencyContacts: {
        type: [emergencyContactSchema],
        validate: {
            validator: function(contacts){
                return contacts.length <= 2;
            },
            message: 'Maximum of 2 emergency contacts allowed'
        }
    },
    caregivers: [{
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
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    deletedAt: Date
}, { 
    timestamps: true 
});


// Enable relevant virtual properties

patientSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`;
});

patientSchema.virtual('age').get(function(){
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    // use month diff to delineate whether birthday has happened yet this year
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()){
        age--;
    }
    return age;
});

//
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });


const PatientModel = mongoose.model('Patient', patientSchema);

module.exports = {
    PatientModel
}