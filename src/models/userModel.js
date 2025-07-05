const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        minLength: [3, 'Username must be at least 3 characters long.'],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.']
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must be at least 8 characters.'],
        trim: true
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const UserModel = mongoose.model("User", UserSchema)

module.exports = {
    UserModel
}