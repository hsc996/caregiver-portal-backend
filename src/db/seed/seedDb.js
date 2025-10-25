require("dotenv").config();

const { dbConnect } = require("../../db/dbFunctions");
const { UserModel } = require("../../models/userModel");
const { PatientModel } = require("../../models/patientModel");

const { seedUsers } = require("./seedUsers");
const { seedHandoverNotes } = require("./seedHandoverNotes");
const { seedPatients } = require("./seedPatients");
const { seedMedications } = require("./seedMedications");
const { seedADLs } = require("./seedADLs");
const { seedShifts } = require("./seedShift");

async function runSeeds() {
  try {
    await dbConnect();

    // seed Users
    await seedUsers();
    const users = await UserModel.find({});
    const userIds = users.map((u) => u._id);

    //seed Patients
    await seedPatients(userIds);
    const patients = await PatientModel.find({});
    const patientIds = patients.map((p) => p._id);

    await seedHandoverNotes(userIds, patientIds);
    await seedMedications(userIds, patientIds);
    await seedADLs(userIds, patientIds);
    await seedShifts(userIds, patientIds);

    console.log("All fields seeded successfully.");
  } catch (error) {
    console.log("An error occurred during seeding: " + error);
  } finally {
    process.exit();
  }
}

runSeeds();
