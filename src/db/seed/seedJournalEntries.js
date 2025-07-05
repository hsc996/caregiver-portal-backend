const { JournalModel } = require('../../models/journalEntryModel');
const mongoose = require("mongoose");

async function seedJournalEntries(userIds){
    if (!userIds || userIds.length === 0){
        throw new Error("No user ID provided.")
    }
    const journalEntries = [
        {
            user: userIds[0],
            title: "First Day of the Build",
            content: "Today I started building my journal app. It was a bit tricky setting up the schema, but satisfying to see it take shape.",
            tags: ["coding", "journal", "progress"]
        },
        {
            user: userIds[1] || userIds[0],
            title: "Design Thoughts",
            content: "Thinking about the user experience. Should I allow rich text formatting? What about image attachments?",
            tags: ["ux", "design", "thoughts"]
        },
        {
            user: userIds[0],
            title: "Debugging Nightmare",
            content: "Spent 3 hours debugging an async issue... turned out to be one missing await. Classic.",
            tags: ["debugging", "javascript", "devlife"]
        }
    ]

    try {
        await JournalModel.deleteMany();
        await JournalModel.insertMany(journalEntries);
        console.log("Journal entries seeded successfully.");
    } catch (error) {
        console.log("An error occurred while seeding the journal entries: " + error);
    }
}

module.exports = {
    seedJournalEntries
}