require('dotenv').config();

const { dbConnect } = require("../../db/dbFunctions");

const { seedUsers } = require("./seedUsers");

async function runSeeds(){
    try {
        await dbConnect();
        await seedUsers();
        console.log("All fields seeded successfully.");
    } catch (error) {
        console.log("An error occurred during seeding: " + error);
    } finally {
        process.exit();
    }
}

runSeeds();