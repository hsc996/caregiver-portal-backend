const { PatientModel } = require("../../models/patientModel");
const { AppError } = (require = "../../functions/helperFunctions.js");

async function seedPatients(caregiverIds) {
  if (!caregiverIds || caregiverIds.length === 0) {
    throw new AppError("No caregiver Id provided");
  }

  const patients = [
    {
      firstName: "Margaret",
      lastName: "Johnson",
      profileImg: null,
      dateOfBirth: new Date("1945-03-15"),
      allergies: ["Penicillin", "Shellfish"],
      alerts: ["Fall risk", "Requires assistance with medication"],
      emergencyContacts: [
        {
          firstName: "Sarah",
          lastName: "Johnson",
          relationship: "Daughter",
          phoneNumber: "555-0101",
          email: "sarah.johnson@example.com",
          isPrimary: true,
        },
        {
          firstName: "Michael",
          lastName: "Johnson",
          relationship: "Son",
          phoneNumber: "555-0102",
          email: "michael.johnson@example.com",
          isPrimary: false,
        },
      ],
      caregivers: [
        {
          userId: caregiverIds[0],
          role: "admin",
        },
      ],
      isActive: true,
    },
    {
      firstName: "Robert",
      lastName: "Chen",
      profileImg: null,
      dateOfBirth: new Date("1938-11-22"),
      allergies: ["Latex", "Aspirin"],
      alerts: ["Diabetes - monitor blood sugar", "Limited mobility"],
      emergencyContacts: [
        {
          firstName: "Linda",
          lastName: "Chen",
          relationship: "Wife",
          phoneNumber: "555-0201",
          email: "linda.chen@example.com",
          isPrimary: true,
        },
      ],
      caregivers: [
        {
          userId: caregiverIds[1] || caregiverIds[0],
          role: "admin",
        },
      ],
      isActive: true,
    },
    {
      firstName: "Dorothy",
      lastName: "Williams",
      profileImg: null,
      dateOfBirth: new Date("1952-07-08"),
      allergies: ["Peanuts", "Sulfa drugs"],
      alerts: ["Memory issues - dementia", "Wandering risk"],
      emergencyContacts: [
        {
          firstName: "James",
          lastName: "Williams",
          relationship: "Husband",
          phoneNumber: "555-0301",
          email: "james.williams@example.com",
          isPrimary: true,
        },
        {
          firstName: "Emma",
          lastName: "Williams",
          relationship: "Daughter",
          phoneNumber: "555-0302",
          email: "emma.williams@example.com",
          isPrimary: false,
        },
      ],
      caregivers: [
        {
          userId: caregiverIds[0],
          role: "admin",
        },
      ],
      isActive: true,
    },
    {
      firstName: "Harold",
      lastName: "Martinez",
      profileImg: null,
      dateOfBirth: new Date("1941-01-30"),
      allergies: [],
      alerts: ["Hard of hearing", "Uses wheelchair"],
      emergencyContacts: [
        {
          firstName: "Rosa",
          lastName: "Martinez",
          relationship: "Daughter",
          phoneNumber: "555-0401",
          email: "rosa.martinez@example.com",
          isPrimary: true,
        },
      ],
      caregivers: [
        {
          userId: caregiverIds[1] || caregiverIds[0],
          role: "admin",
        },
      ],
      isActive: true,
    },
    {
      firstName: "Eleanor",
      lastName: "Thompson",
      profileImg: null,
      dateOfBirth: new Date("1948-09-12"),
      allergies: ["Iodine", "Morphine"],
      alerts: ["Heart condition - monitor vitals", "Oxygen required at night"],
      emergencyContacts: [
        {
          firstName: "Thomas",
          lastName: "Thompson",
          relationship: "Son",
          phoneNumber: "555-0501",
          email: "thomas.thompson@example.com",
          isPrimary: true,
        },
        {
          firstName: "Alice",
          lastName: "Davis",
          relationship: "Daughter",
          phoneNumber: "555-0502",
          email: "alice.davis@example.com",
          isPrimary: false,
        },
      ],
      caregivers: [
        {
          userId: caregiverIds[0],
          role: "admin",
        },
      ],
      isActive: true,
    },
  ];

  try {
    await PatientModel.deleteMany();
    await PatientModel.insertMany(patients);
    console.log("Patient data seeded successfully.");
  } catch (error) {
    console.log("An error occurred while seeding the patient data: " + error);
    throw error;
  }
}

module.exports = {
    seedPatients
}