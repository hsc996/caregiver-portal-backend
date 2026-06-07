require("dotenv").config();

const { dbConnect } = require("../../db/dbFunctions");
const { CompanyModel } = require("../../models/companyModel");
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

    // Create the seed company first — everything hangs off this
    await CompanyModel.deleteMany();
    const company = await CompanyModel.create({
      name: "Sunrise Care",
      createdBy: null, // updated after first user is created
    });
    const companyId = company._id;

    // Seed users (all belong to this company)
    await seedUsers(companyId);
    const users = await UserModel.find({ companyId });
    const userIds = users.map((u) => u._id);

    // Point company.createdBy at the first (Admin) user
    company.createdBy = userIds[0];
    await company.save();

    // Seed patients (all belong to this company)
    await seedPatients(companyId);
    const patients = await PatientModel.find({ companyId });
    const patientIds = patients.map((p) => p._id);

    await seedHandoverNotes(userIds, patientIds, companyId);
    await seedMedications(userIds, patientIds, companyId);
    await seedADLs(userIds, patientIds, companyId);
    await seedShifts(companyId, userIds, patientIds);

    console.log("All fields seeded successfully.");
  } catch (error) {
    console.log("An error occurred during seeding: " + error);
  } finally {
    process.exit();
  }
}

runSeeds();
