require('dotenv').config();

const { dbConnect } = require("../../db/dbFunctions");

const { seedUsers } = require("./seedUsers");
const { seedJournalEntries } = require("./seedJournalEntries");
const { UserModel } = require('../../models/userModel');

async function runSeeds(){
    try {
        await dbConnect();
        await seedUsers();
        
        const users = await UserModel.find({});
        const userIds = users.map(u => u._id);

        await seedJournalEntries(userIds);

        console.log("All fields seeded successfully.");
    } catch (error) {
        console.log("An error occurred during seeding: " + error);
    } finally {
        process.exit();
    }
}

runSeeds();