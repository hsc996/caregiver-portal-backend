const mongoose = require("mongoose");

const CodeSnippetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    language: {
        type: String,
        required: true,
        enum: ['JavaScript', 'Python', 'Java', 'C++', 'C', 'C#', 'Go', 'Rust', 'Swift', 'TypeScript', 'Kotlin', 'Ruby', 'PHP', 'R', 'HTML', 'CSS', 'SQL', 'Other']
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: arr => arr.every(tag => typeof tag === 'string'),
            message: "Tags must be strings."
        }
    },
    notes: {
        type: String,
        trim: true,
        maxLength: 5000
    }
}, { timestamp: true});

const CodeSnippetModel = mongoose.model('CodeSnippet', CodeSnippetSchema);

module.exports = {
    CodeSnippetModel
}