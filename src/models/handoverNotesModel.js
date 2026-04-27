const mongoose = require("mongoose");

const HandoverSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: [100, "Title must not exceed 100 characters."],
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: (arr) => arr.every((tag) => typeof tag === "string"),
            message: "All tags must be strings.",
        },
    },
}, { timestamps: true });

HandoverSchema.index({ patientId: 1, createdAt: -1 });
HandoverSchema.index({ userId: 1, createdAt: -1 });

const HandoverModel = mongoose.model("HandoverNotes", HandoverSchema);

module.exports = { HandoverModel };
