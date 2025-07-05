const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

const JournalModel = mongoose.model('Journal', JournalSchema);

module.exports = {
    JournalModel
}