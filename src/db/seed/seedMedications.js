const { MedicationModel } = require("../../models/medicationModel");
const { AppError } = require("../../functions/helperFunctions");

async function seedMedications(caregiverIds, patientIds, companyId) {
    if (!caregiverIds || caregiverIds.length === 0) {
        throw new AppError("No caregiver IDs provided", 400);
    }
    if (!patientIds || patientIds.length === 0) {
        throw new AppError("No patient IDs provided", 400);
    }
    if (!companyId) {
        throw new AppError("No companyId provided", 400);
    }

    // Helper function to simulate dates for the past week
    const getDateDaysAgo = (days, hour = 8, minute = 0) => {
        const date = new Date();
        date.setDate(date.getDate() - days);
        date.setHours(hour, minute, 0, 0);
        return date;
    };

    const medicationAdministrations = [
      // Margaret Johnson - Patient 0 (Blood Pressure Meds)
      // Today - Morning
      {
        companyId,
        patientId: patientIds[0],
        medicationName: "Lisinopril",
        dosage: "10mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(0, 8, 5),
        administeredBy: caregiverIds[0],
        status: "given",
        notes:
          "Patient took medication with breakfast. No adverse effects noted.",
      },
      {
        companyId,
        patientId: patientIds[0],
        medicationName: "Aspirin",
        dosage: "81mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(0, 8, 5),
        administeredBy: caregiverIds[0],
        status: "given",
        notes: "Given with food as directed.",
      },
      {
        companyId,
        patientId: patientIds[0],
        medicationName: "Vitamin D",
        dosage: "2000 IU",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(0, 8, 5),
        administeredBy: caregiverIds[0],
        status: "given",
      },

      // Yesterday - Morning
      {
        companyId,
        patientId: patientIds[0],
        medicationName: "Lisinopril",
        dosage: "10mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(1, 8, 10),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
        notes: "BP before medication: 138/82",
      },
      {
        companyId,
        patientId: patientIds[0],
        medicationName: "Aspirin",
        dosage: "81mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(1, 8, 10),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
      },

      // Robert Chen - Patient 1 (Diabetes Medications)
      // Today - Morning
      {
        companyId,
        patientId: patientIds[1],
        medicationName: "Metformin",
        dosage: "500mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(0, 8, 0),
        administeredBy: caregiverIds[0],
        status: "given",
        notes: "Blood glucose before: 142 mg/dL. Given with breakfast.",
      },
      {
        companyId,
        patientId: patientIds[1],
        medicationName: "Atorvastatin",
        dosage: "20mg",
        route: "Oral",
        scheduledTime: "20:00",
        actualAdministrationTime: getDateDaysAgo(0, 20, 5),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
        notes: "Given with evening snack.",
      },

      // Today - Evening Insulin
      {
        companyId,
        patientId: patientIds[1],
        medicationName: "Insulin (Lantus)",
        dosage: "20 units",
        route: "Subcutaneous",
        scheduledTime: "22:00",
        actualAdministrationTime: getDateDaysAgo(0, 22, 0),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
        notes: "Administered in abdomen. Site rotated. No redness or swelling.",
        witnessedBy: caregiverIds[0],
      },

      // Yesterday - Refused dose
      {
        companyId,
        patientId: patientIds[1],
        medicationName: "Metformin",
        dosage: "500mg",
        route: "Oral",
        scheduledTime: "18:00",
        actualAdministrationTime: getDateDaysAgo(1, 18, 15),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "refused",
        refusalReason: "Patient feeling nauseous. Declined evening dose.",
        notes: "Physician notified. Will retry tomorrow.",
      },

      // Dorothy Williams - Patient 2 (Dementia Medications)
      // Today - Morning
      {
        companyId,
        patientId: patientIds[2],
        medicationName: "Memantine",
        dosage: "10mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(0, 8, 15),
        administeredBy: caregiverIds[0],
        status: "given",
        notes: "Patient cooperative. Mixed with applesauce.",
      },

      // Today - Evening
      {
        companyId,
        patientId: patientIds[2],
        medicationName: "Donepezil",
        dosage: "10mg",
        route: "Oral",
        scheduledTime: "20:00",
        actualAdministrationTime: getDateDaysAgo(0, 20, 10),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
        notes: "Given with dinner.",
      },
      {
        companyId,
        patientId: patientIds[2],
        medicationName: "Memantine",
        dosage: "10mg",
        route: "Oral",
        scheduledTime: "20:00",
        actualAdministrationTime: getDateDaysAgo(0, 20, 10),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
      },
      {
        companyId,
        patientId: patientIds[2],
        medicationName: "Melatonin",
        dosage: "3mg",
        route: "Oral",
        scheduledTime: "21:00",
        actualAdministrationTime: getDateDaysAgo(0, 21, 0),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
        notes: "Given at bedtime to assist with sleep.",
      },

      // 2 days ago - Missed dose
      {
        companyId,
        patientId: patientIds[2],
        medicationName: "Melatonin",
        dosage: "3mg",
        route: "Oral",
        scheduledTime: "21:00",
        actualAdministrationTime: getDateDaysAgo(2, 21, 30),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "missed",
        notes:
          "Patient already asleep at scheduled time. Did not wake for medication.",
      },

      // Harold Martinez - Patient 3 (Anticoagulant)
      // Today - Evening
      {
        companyId,
        patientId: patientIds[3],
        medicationName: "Warfarin",
        dosage: "5mg",
        route: "Oral",
        scheduledTime: "18:00",
        actualAdministrationTime: getDateDaysAgo(0, 18, 5),
        administeredBy: caregiverIds[0],
        status: "given",
        notes:
          "Given at same time daily for consistency. Patient tolerating well.",
      },
      {
        companyId,
        patientId: patientIds[3],
        medicationName: "Multivitamin",
        dosage: "1 tablet",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(0, 8, 0),
        administeredBy: caregiverIds[0],
        status: "given",
        notes: "Given with breakfast.",
      },

      // Yesterday
      {
        companyId,
        patientId: patientIds[3],
        medicationName: "Warfarin",
        dosage: "5mg",
        route: "Oral",
        scheduledTime: "18:00",
        actualAdministrationTime: getDateDaysAgo(1, 18, 0),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
        notes: "INR levels checked this week - within therapeutic range.",
      },

      // Eleanor Thompson - Patient 4 (Cardiac Medications)
      // Today - Morning
      {
        companyId,
        patientId: patientIds[4],
        medicationName: "Furosemide",
        dosage: "40mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(0, 8, 5),
        administeredBy: caregiverIds[0],
        status: "given",
        notes:
          "Given early morning to avoid nighttime urination. BP: 128/76, HR: 74",
      },
      {
        companyId,
        patientId: patientIds[4],
        medicationName: "Carvedilol",
        dosage: "25mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(0, 8, 5),
        administeredBy: caregiverIds[0],
        status: "given",
        notes: "Vital signs stable before administration.",
      },
      {
        companyId,
        patientId: patientIds[4],
        medicationName: "Digoxin",
        dosage: "0.125mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(0, 8, 5),
        administeredBy: caregiverIds[0],
        status: "given",
        notes: "Heart rate checked: 76 bpm regular rhythm.",
      },

      // Today - Evening
      {
        companyId,
        patientId: patientIds[4],
        medicationName: "Carvedilol",
        dosage: "25mg",
        route: "Oral",
        scheduledTime: "20:00",
        actualAdministrationTime: getDateDaysAgo(0, 20, 0),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
        notes: "BP: 132/78, HR: 72. No dizziness reported.",
      },

      // Yesterday - PRN medication
      {
        companyId,
        patientId: patientIds[4],
        medicationName: "Nitroglycerin",
        dosage: "0.4mg",
        route: "Sublingual",
        scheduledTime: "PRN",
        actualAdministrationTime: getDateDaysAgo(1, 14, 30),
        administeredBy: caregiverIds[0],
        status: "given",
        notes:
          "Patient complained of chest discomfort during activity. One dose given. Symptoms resolved within 5 minutes. Physician notified.",
        witnessedBy: caregiverIds[1] || caregiverIds[0],
      },

      // 3 days ago - Held medication
      {
        companyId,
        patientId: patientIds[4],
        medicationName: "Furosemide",
        dosage: "40mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(3, 8, 0),
        administeredBy: caregiverIds[0],
        status: "held",
        notes:
          "BP: 96/58 - below parameters. Medication held per protocol. Physician contacted.",
      },

      // Additional historical records for past week
      // Margaret - 3 days ago
      {
        companyId,
        patientId: patientIds[0],
        medicationName: "Lisinopril",
        dosage: "10mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(3, 8, 0),
        administeredBy: caregiverIds[0],
        status: "given",
      },

      // Robert - 2 days ago
      {
        companyId,
        patientId: patientIds[1],
        medicationName: "Insulin (Lantus)",
        dosage: "20 units",
        route: "Subcutaneous",
        scheduledTime: "22:00",
        actualAdministrationTime: getDateDaysAgo(2, 22, 5),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
        notes: "Injection site: right thigh. No complications.",
      },

      // Dorothy - 4 days ago
      {
        companyId,
        patientId: patientIds[2],
        medicationName: "Donepezil",
        dosage: "10mg",
        route: "Oral",
        scheduledTime: "20:00",
        actualAdministrationTime: getDateDaysAgo(4, 20, 15),
        administeredBy: caregiverIds[0],
        status: "given",
        notes: "Patient slightly confused but cooperative.",
      },

      // Harold - 5 days ago
      {
        companyId,
        patientId: patientIds[3],
        medicationName: "Warfarin",
        dosage: "5mg",
        route: "Oral",
        scheduledTime: "18:00",
        actualAdministrationTime: getDateDaysAgo(5, 18, 0),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "given",
      },

      // Eleanor - 6 days ago
      {
        companyId,
        patientId: patientIds[4],
        medicationName: "Furosemide",
        dosage: "40mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(6, 8, 10),
        administeredBy: caregiverIds[0],
        status: "given",
        notes: "Weight checked: stable. No edema noted.",
      },

      // ========== UNVALIDATED RECORDS ==========

      // Margaret Johnson - Validated in error yesterday, caught by second caregiver
      {
        companyId,
        patientId: patientIds[0],
        medicationName: "Aspirin",
        dosage: "81mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(2, 8, 20),
        administeredBy: caregiverIds[0],
        status: "unvalidated",
        notes: "Logged in error during handover.",
        unvalidatedAt: getDateDaysAgo(2, 9, 5),
        unvalidatedBy: caregiverIds[1] || caregiverIds[0],
        unvalidationReason: "Validated but not administered",
      },

      // Robert Chen - Wrong dose recorded, corrected by same caregiver
      {
        companyId,
        patientId: patientIds[1],
        medicationName: "Metformin",
        dosage: "500mg",
        route: "Oral",
        scheduledTime: "08:00",
        actualAdministrationTime: getDateDaysAgo(3, 8, 5),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "unvalidated",
        unvalidatedAt: getDateDaysAgo(3, 8, 30),
        unvalidatedBy: caregiverIds[1] || caregiverIds[0],
        unvalidationReason: "Administered in error — wrong dose",
      },

      // Dorothy Williams - Documentation error, record created for wrong patient
      {
        companyId,
        patientId: patientIds[2],
        medicationName: "Donepezil",
        dosage: "10mg",
        route: "Oral",
        scheduledTime: "20:00",
        actualAdministrationTime: getDateDaysAgo(1, 20, 0),
        administeredBy: caregiverIds[0],
        status: "unvalidated",
        notes: "Record was created under incorrect patient by mistake.",
        unvalidatedAt: getDateDaysAgo(1, 20, 45),
        unvalidatedBy: caregiverIds[0],
        unvalidationReason: "Documentation error",
      },

      // Eleanor Thompson - Patient refused after record was already created
      {
        companyId,
        patientId: patientIds[4],
        medicationName: "Carvedilol",
        dosage: "25mg",
        route: "Oral",
        scheduledTime: "20:00",
        actualAdministrationTime: getDateDaysAgo(4, 20, 0),
        administeredBy: caregiverIds[1] || caregiverIds[0],
        status: "unvalidated",
        notes: "Record submitted prematurely before patient took the dose.",
        unvalidatedAt: getDateDaysAgo(4, 20, 20),
        unvalidatedBy: caregiverIds[1] || caregiverIds[0],
        unvalidationReason: "Patient refused after record was created",
      },

      // Harold Martinez - Wrong time logged, entered manually
      {
        companyId,
        patientId: patientIds[3],
        medicationName: "Warfarin",
        dosage: "5mg",
        route: "Oral",
        scheduledTime: "18:00",
        actualAdministrationTime: getDateDaysAgo(5, 18, 0),
        administeredBy: caregiverIds[0],
        status: "unvalidated",
        unvalidatedAt: getDateDaysAgo(5, 19, 10),
        unvalidatedBy: caregiverIds[2] || caregiverIds[0],
        unvalidationReason: "Administered in error — wrong time of day",
      },
    ];

    try {
      await MedicationModel.deleteMany();
      await MedicationModel.insertMany(medicationAdministrations);
      console.log(
        `Medication administration records seeded successfully.`
      );
    } catch (error) {
      console.log(
        "An error occurred while seeding medication administrations: " + error
      );
      throw error;
    }
}

module.exports = {
  seedMedications,
};
