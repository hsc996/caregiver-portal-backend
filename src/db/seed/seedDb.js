require('dotenv').config();

const { dbConnect } = require("../../db/dbFunctions");
const { UserModel } = require('../../models/userModel');

const { seedUsers } = require("./seedUsers");
const { seedJournalEntries } = require("./seedJournalEntries");
const { seedCodeSnippets } = require('./seedCodeSnippets');
const { seedBookmarks } = require('./seedBookmarks');

async function runSeeds(){
    try {
        await dbConnect();
        await seedUsers();
        
        const users = await UserModel.find({});
        const userIds = users.map(u => u._id);

        await seedJournalEntries(userIds);
        await seedCodeSnippets(userIds);
        await seedBookmarks(userIds)

    } catch (error) {
        console.log("An error occurred during seeding: " + error);
    } finally {
        console.log("All fields seeded successfully.");
        process.exit();
    }
}

runSeeds();