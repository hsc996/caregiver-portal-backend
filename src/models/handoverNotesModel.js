const mongoose = require("mongoose");

const HandoverSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: [100, 'Titles must not exceed too characters.']
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (arr) {
                return arr.every(tag => typeof tag === 'string')
            },
            message: 'All tags must be strings.'
        }
    }
}, { timestamps: true });

const HandoverModel = mongoose.model('HandoverNotes', HandoverSchema);

module.exports = {
    HandoverModel
}