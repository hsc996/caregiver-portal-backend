require('dotenv').config();

const { dbConnect } = require("../../db/dbFunctions");
const { UserModel } = require('../../models/userModel');
const { PatientModel } = require("../../models/patientModel");

const { seedUsers } = require("./seedUsers");
const { seedHandoverNotes } = require("./seedHandoverNotes");
const { seedPatients } = require("./seedPatients");

async function runSeeds(){
    try {
        await dbConnect();
        await seedUsers();
        
        const users = await UserModel.find({});
        const userIds = users.map(u => u._id);

        const patients = await PatientModel.find({});
        const patientIds = patients.map(u => u._id);


        await seedHandoverNotes(users, patientIds);
        await seedPatients(userIds);

    } catch (error) {
        console.log("An error occurred during seeding: " + error);
    } finally {
        console.log("All fields seeded successfully.");
        process.exit();
    }
}

runSeeds();