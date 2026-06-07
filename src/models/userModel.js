const { hashPassword } = require("../functions/jwtFunctions");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minLength: [3, 'Username must be at least 3 characters long'],
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
        index: true
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'Password must be at least 8 characters'],
        validate: {
            validator: function(password){
                if (password.startsWith('$2b$')) {
                    return true;
                }
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return passwordRegex.test(password);
            },
            message: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'
        }
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company is required'],
        index: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    lastLogin: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    deletedAt: {
        type: Date,
        index: true
    },
    lastPasswordChange: {
    type: Date,
    default: null
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    profileImg: {
        type: String,
        default: null
    },
    refreshTokenHash: {
        type: String,
        default: null
    },
}, { timestamps: true })

// Compound index for common queries
UserSchema.index({ companyId: 1, isActive: 1, deletedAt: 1 });

// Auto-hash password in pre-save hook
UserSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        return next();
    }

    try {
        this.password = await hashPassword(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

// Helper method to safely return user without password
UserSchema.methods.toSafeObject = function(){
    const obj = this.toObject();
    delete obj.password;
    delete obj.passwordResetToken;
    delete obj.passwordResetExpires;
    delete obj.refreshTokenHash;
    delete obj.__v;
    return obj;
};

const UserModel = mongoose.model("User", UserSchema)

module.exports = {
    UserModel
}