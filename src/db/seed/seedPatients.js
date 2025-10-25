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
      medicationSchedule: [
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          scheduledTimes: ["08:00"],
          route: "Oral",
          prescribedBy: "Dr. Sarah Mitchell",
          startDate: new Date("2024-01-15"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Aspirin",
          dosage: "81mg",
          frequency: "Once daily",
          scheduledTimes: ["08:00"],
          route: "Oral",
          prescribedBy: "Dr. Sarah Mitchell",
          startDate: new Date("2024-01-15"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Vitamin D",
          dosage: "2000 IU",
          frequency: "Once daily",
          scheduledTimes: ["08:00"],
          route: "Oral",
          prescribedBy: "Dr. Sarah Mitchell",
          startDate: new Date("2024-03-01"),
          endDate: null,
          isActive: true,
        },
      ],
      careTaskSchedule: [
        {
          task: "Blood pressure check",
          frequency: "Twice daily",
          category: "medication",
          instructions:
            "Check before morning and evening medications. Record readings.",
        },
        {
          task: "Assist with shower",
          frequency: "Daily",
          category: "personal-care",
          instructions:
            "Morning shower. Ensure non-slip mat is in place. Stay within arm's reach.",
        },
        {
          task: "Walk with walker",
          frequency: "Three times daily",
          category: "mobility",
          instructions:
            "Short walks around unit. Monitor for dizziness or fatigue.",
        },
        {
          task: "Fall risk assessment",
          frequency: "Each shift",
          category: "safety",
          instructions:
            "Check environment for hazards. Ensure call button within reach.",
        },
      ],
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
      medicationSchedule: [
        {
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          scheduledTimes: ["08:00", "18:00"],
          route: "Oral",
          prescribedBy: "Dr. James Park",
          startDate: new Date("2023-06-10"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Insulin (Lantus)",
          dosage: "20 units",
          frequency: "Once daily",
          scheduledTimes: ["22:00"],
          route: "Subcutaneous injection",
          prescribedBy: "Dr. James Park",
          startDate: new Date("2023-06-10"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Atorvastatin",
          dosage: "20mg",
          frequency: "Once daily",
          scheduledTimes: ["20:00"],
          route: "Oral",
          prescribedBy: "Dr. James Park",
          startDate: new Date("2023-08-15"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Ibuprofen",
          dosage: "400mg",
          frequency: "As needed",
          scheduledTimes: ["08:00", "20:00"],
          route: "Oral",
          prescribedBy: "Dr. James Park",
          startDate: new Date("2024-09-01"),
          endDate: null,
          isActive: true,
        },
      ],
      careTaskSchedule: [
        {
          task: "Blood glucose monitoring",
          frequency: "Four times daily",
          category: "medication",
          instructions:
            "Before meals and at bedtime. Record all readings. Alert if <70 or >250.",
        },
        {
          task: "Diabetic foot check",
          frequency: "Daily",
          category: "personal-care",
          instructions:
            "Inspect feet for cuts, blisters, or pressure areas. Apply moisturizer.",
        },
        {
          task: "Transfer assistance",
          frequency: "As needed",
          category: "mobility",
          instructions:
            "Use gait belt. Allow patient to set pace. Monitor for pain.",
        },
        {
          task: "Diet monitoring",
          frequency: "Each meal",
          category: "nutrition",
          instructions:
            "Ensure diabetic diet compliance. Record carb intake and meal percentages.",
        },
      ],
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
      medicationSchedule: [
        {
          name: "Donepezil",
          dosage: "10mg",
          frequency: "Once daily",
          scheduledTimes: ["20:00"],
          route: "Oral",
          prescribedBy: "Dr. Emily Rogers",
          startDate: new Date("2023-02-20"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Memantine",
          dosage: "10mg",
          frequency: "Twice daily",
          scheduledTimes: ["08:00", "20:00"],
          route: "Oral",
          prescribedBy: "Dr. Emily Rogers",
          startDate: new Date("2023-05-15"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Melatonin",
          dosage: "3mg",
          frequency: "Once daily",
          scheduledTimes: ["21:00"],
          route: "Oral",
          prescribedBy: "Dr. Emily Rogers",
          startDate: new Date("2024-01-10"),
          endDate: null,
          isActive: true,
        },
      ],
      careTaskSchedule: [
        {
          task: "Cognitive activities",
          frequency: "Daily",
          category: "other",
          instructions:
            "Puzzles, music therapy, or reminiscence activities. 30-45 minutes.",
        },
        {
          task: "Wandering prevention check",
          frequency: "Each shift",
          category: "safety",
          instructions:
            "Verify door alarms functioning. Redirect if attempting to leave.",
        },
        {
          task: "Orientation reminders",
          frequency: "As needed",
          category: "other",
          instructions:
            "Gentle reminders of date, time, location. Use calendar and family photos.",
        },
        {
          task: "Structured routine",
          frequency: "Daily",
          category: "other",
          instructions:
            "Maintain consistent schedule. Minimize changes. Reduce evening stimulation.",
        },
      ],
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
      medicationSchedule: [
        {
          name: "Warfarin",
          dosage: "5mg",
          frequency: "Once daily",
          scheduledTimes: ["18:00"],
          route: "Oral",
          prescribedBy: "Dr. Thomas Chen",
          startDate: new Date("2022-11-05"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Multivitamin",
          dosage: "1 tablet",
          frequency: "Once daily",
          scheduledTimes: ["08:00"],
          route: "Oral",
          prescribedBy: "Dr. Thomas Chen",
          startDate: new Date("2023-01-01"),
          endDate: null,
          isActive: true,
        },
      ],
      careTaskSchedule: [
        {
          task: "Hearing aid maintenance",
          frequency: "Daily",
          category: "other",
          instructions: "Check battery. Clean as needed. Ensure proper fit.",
        },
        {
          task: "Wheelchair positioning",
          frequency: "Every 2 hours",
          category: "mobility",
          instructions:
            "Pressure relief. Check cushion. Inspect skin for pressure areas.",
        },
        {
          task: "Range of motion exercises",
          frequency: "Twice daily",
          category: "mobility",
          instructions:
            "Upper and lower extremities. Follow PT plan. 15 minutes each session.",
        },
        {
          task: "Communication check",
          frequency: "Each interaction",
          category: "other",
          instructions:
            "Face patient when speaking. Speak clearly. Ensure hearing aid is in place.",
        },
      ],
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
      medicationSchedule: [
        {
          name: "Furosemide",
          dosage: "40mg",
          frequency: "Once daily",
          scheduledTimes: ["08:00"],
          route: "Oral",
          prescribedBy: "Dr. Michael Stevens",
          startDate: new Date("2023-03-12"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Carvedilol",
          dosage: "25mg",
          frequency: "Twice daily",
          scheduledTimes: ["08:00", "20:00"],
          route: "Oral",
          prescribedBy: "Dr. Michael Stevens",
          startDate: new Date("2023-03-12"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Digoxin",
          dosage: "0.125mg",
          frequency: "Once daily",
          scheduledTimes: ["08:00"],
          route: "Oral",
          prescribedBy: "Dr. Michael Stevens",
          startDate: new Date("2023-03-12"),
          endDate: null,
          isActive: true,
        },
        {
          name: "Nitroglycerin",
          dosage: "0.4mg",
          frequency: "As needed",
          scheduledTimes: [],
          route: "Sublingual",
          prescribedBy: "Dr. Michael Stevens",
          startDate: new Date("2023-03-12"),
          endDate: null,
          isActive: true,
        },
      ],
      careTaskSchedule: [
        {
          task: "Vital signs monitoring",
          frequency: "Three times daily",
          category: "medication",
          instructions:
            "BP, HR, O2 sat, temp. Record all readings. Alert for abnormals.",
        },
        {
          task: "Oxygen therapy",
          frequency: "Nightly",
          category: "other",
          instructions:
            "2-3L via nasal cannula. Check equipment. Monitor saturation levels.",
        },
        {
          task: "Fluid intake/output",
          frequency: "Daily",
          category: "nutrition",
          instructions:
            "Record all intake and output. Monitor for edema. Report concerns.",
        },
        {
          task: "Activity tolerance",
          frequency: "Each shift",
          category: "mobility",
          instructions:
            "Short walks as tolerated. Monitor for SOB or chest pain. Allow rest periods.",
        },
        {
          task: "Weight monitoring",
          frequency: "Weekly",
          category: "other",
          instructions:
            "Same time, same scale. Report weight gain of >3lbs in 24hrs.",
        },
      ],
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
  seedPatients,
};
