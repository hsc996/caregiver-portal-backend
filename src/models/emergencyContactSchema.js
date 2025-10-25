const mongoose = require("mongoose");

const EmergencyContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your full name.'],
        trim: true
    },
    relationship: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
}, { _id: false });

module.exports = {
    EmergencyContactSchema
}