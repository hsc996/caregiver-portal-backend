const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: value => /^https?:\/\/.+\..+/.test(value),
            message: 'Invalid URL format.'
        }
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    category: {
        type: String,
        trim: true,
        default: "Uncategorised"
        // AI to assign categories
    }
}, { timestamps: true });

const BookmarkModel = mongoose.model("Bookmark", BookmarkSchema);

module.exports = {
    BookmarkModel
}