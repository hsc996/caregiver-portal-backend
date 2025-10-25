const { ADLRecordModel } = require("../../models/adlModel");
const { AppError } = require("../../functions/helperFunctions");

async function seedADLs(caregiverIds, patientIds) {
  if (!caregiverIds || caregiverIds.length === 0) {
    throw new AppError("No caregiver ID provided.", 400);
  }
  if (!patientIds || patientIds.length === 0) {
    throw new AppError("No patient ID provided.", 400);
  }

  const getDateDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getTimeWithDate = (days, hour, minute = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const adlRecords = [
    // Margaret Johnson - Patient 0 - Today Morning Shift
    {
      patientId: patientIds[0],
      date: getDateDaysAgo(0),
      shift: "morning",
      activities: {
        bathing: {
          completed: true,
          assistanceLevel: "minimal",
          time: getTimeWithDate(0, 7, 30),
          notes:
            "Shower completed. Patient steady with grab bars. No dizziness reported.",
        },
        dressing: {
          completed: true,
          assistanceLevel: "supervision",
          time: getTimeWithDate(0, 8, 0),
          notes:
            "Patient dressed independently. Supervised for safety due to fall risk.",
        },
        toileting: {
          completed: true,
          assistanceLevel: "independent",
          time: getTimeWithDate(0, 7, 0),
          notes: "No assistance required.",
        },
        eating: {
          completed: true,
          assistanceLevel: "independent",
          mealType: "Breakfast",
          amountConsumed: "100%",
          time: getTimeWithDate(0, 8, 30),
          notes: "Ate full breakfast. Good appetite.",
        },
        mobility: {
          completed: true,
          assistanceLevel: "supervision",
          distance: "50 feet",
          time: getTimeWithDate(0, 9, 30),
          notes: "Walked in hallway with walker. Steady gait. No SOB.",
        },
        positioning: {
          completed: true,
          time: getTimeWithDate(0, 10, 0),
          notes: "Repositioned in chair for comfort.",
        },
      },
      vitalSigns: {
        bloodPressure: {
          systolic: 138,
          diastolic: 82,
          time: getTimeWithDate(0, 8, 0),
        },
        heartRate: {
          value: 76,
          time: getTimeWithDate(0, 8, 0),
        },
        temperature: {
          value: 98.2,
          unit: "F",
          time: getTimeWithDate(0, 8, 0),
        },
      },
      recordedBy: caregiverIds[0],
    },

    // Margaret Johnson - Today Afternoon Shift
    {
      patientId: patientIds[0],
      date: getDateDaysAgo(0),
      shift: "afternoon",
      activities: {
        toileting: {
          completed: true,
          assistanceLevel: "independent",
          time: getTimeWithDate(0, 14, 0),
        },
        eating: {
          completed: true,
          assistanceLevel: "independent",
          mealType: "Lunch",
          amountConsumed: "75%",
          time: getTimeWithDate(0, 12, 30),
          notes: "Smaller appetite at lunch. Encouraged fluids.",
        },
        mobility: {
          completed: true,
          assistanceLevel: "supervision",
          distance: "30 feet",
          time: getTimeWithDate(0, 15, 0),
          notes: "Short walk to activity room.",
        },
        positioning: {
          completed: true,
          time: getTimeWithDate(0, 13, 30),
          notes: "Repositioned after lunch.",
        },
      },
      vitalSigns: {
        bloodPressure: {
          systolic: 132,
          diastolic: 78,
          time: getTimeWithDate(0, 14, 0),
        },
      },
      recordedBy: caregiverIds[1] || caregiverIds[0],
    },

    // Robert Chen - Patient 1 - Today Morning Shift
    {
      patientId: patientIds[1],
      date: getDateDaysAgo(0),
      shift: "morning",
      activities: {
        bathing: {
          completed: true,
          assistanceLevel: "moderate",
          time: getTimeWithDate(0, 7, 0),
          notes:
            "Bed bath. Patient reports knee pain. Gentle assistance provided.",
        },
        dressing: {
          completed: true,
          assistanceLevel: "moderate",
          time: getTimeWithDate(0, 7, 45),
          notes: "Assistance with lower body dressing due to limited mobility.",
        },
        toileting: {
          completed: true,
          assistanceLevel: "minimal",
          time: getTimeWithDate(0, 6, 30),
          notes: "Transfer assistance provided.",
        },
        eating: {
          completed: true,
          assistanceLevel: "supervision",
          mealType: "Breakfast",
          amountConsumed: "80%",
          time: getTimeWithDate(0, 8, 0),
          notes: "Diabetic diet. Good portion consumed.",
        },
        mobility: {
          completed: true,
          assistanceLevel: "moderate",
          distance: "10 feet",
          time: getTimeWithDate(0, 9, 0),
          notes: "Transfer from bed to wheelchair. Uses gait belt.",
        },
        positioning: {
          completed: true,
          time: getTimeWithDate(0, 10, 0),
          notes:
            "Repositioned in wheelchair. Cushion adjusted for pressure relief.",
        },
      },
      vitalSigns: {
        bloodPressure: {
          systolic: 128,
          diastolic: 76,
          time: getTimeWithDate(0, 8, 0),
        },
        heartRate: {
          value: 72,
          time: getTimeWithDate(0, 8, 0),
        },
        temperature: {
          value: 97.8,
          unit: "F",
          time: getTimeWithDate(0, 8, 0),
        },
        bloodGlucose: {
          value: 142,
          time: getTimeWithDate(0, 7, 30),
        },
      },
      recordedBy: caregiverIds[0],
    },

    // Robert Chen - Today Afternoon Shift
    {
      patientId: patientIds[1],
      date: getDateDaysAgo(0),
      shift: "afternoon",
      activities: {
        toileting: {
          completed: true,
          assistanceLevel: "minimal",
          time: getTimeWithDate(0, 13, 0),
        },
        eating: {
          completed: true,
          assistanceLevel: "supervision",
          mealType: "Lunch",
          amountConsumed: "90%",
          time: getTimeWithDate(0, 12, 0),
          notes: "Good appetite. Carb intake recorded.",
        },
        positioning: {
          completed: true,
          time: getTimeWithDate(0, 14, 30),
          notes: "Pressure relief. Skin check - no issues noted.",
        },
      },
      vitalSigns: {
        bloodGlucose: {
          value: 156,
          time: getTimeWithDate(0, 11, 45),
        },
      },
      recordedBy: caregiverIds[1] || caregiverIds[0],
    },

    // Dorothy Williams - Patient 2 - Today Morning Shift
    {
      patientId: patientIds[2],
      date: getDateDaysAgo(0),
      shift: "morning",
      activities: {
        bathing: {
          completed: true,
          assistanceLevel: "full",
          time: getTimeWithDate(0, 7, 30),
          notes:
            "Full assistance with shower. Patient cooperative. Gentle redirection needed.",
        },
        dressing: {
          completed: true,
          assistanceLevel: "full",
          time: getTimeWithDate(0, 8, 15),
          notes:
            "Patient confused about clothing choices. Staff selected appropriate attire.",
        },
        toileting: {
          completed: true,
          assistanceLevel: "moderate",
          time: getTimeWithDate(0, 7, 0),
          notes: "Prompted toileting. Assistance required.",
        },
        eating: {
          completed: true,
          assistanceLevel: "supervision",
          mealType: "Breakfast",
          amountConsumed: "60%",
          time: getTimeWithDate(0, 8, 45),
          notes: "Slow to eat. Required verbal prompts. Fair appetite.",
        },
        mobility: {
          completed: true,
          assistanceLevel: "full",
          distance: "20 feet",
          time: getTimeWithDate(0, 9, 30),
          notes:
            "Walking with assistance. Unsteady gait. Close supervision required.",
        },
        positioning: {
          completed: true,
          time: getTimeWithDate(0, 10, 30),
          notes: "Seated comfortably in common area.",
        },
      },
      vitalSigns: {
        bloodPressure: {
          systolic: 124,
          diastolic: 72,
          time: getTimeWithDate(0, 8, 0),
        },
        heartRate: {
          value: 68,
          time: getTimeWithDate(0, 8, 0),
        },
        temperature: {
          value: 98.0,
          unit: "F",
          time: getTimeWithDate(0, 8, 0),
        },
      },
      recordedBy: caregiverIds[0],
    },

    // Harold Martinez - Patient 3 - Today Morning Shift
    {
      patientId: patientIds[3],
      date: getDateDaysAgo(0),
      shift: "morning",
      activities: {
        bathing: {
          completed: true,
          assistanceLevel: "moderate",
          time: getTimeWithDate(0, 7, 0),
          notes: "Bed bath. Transfer assistance provided. Patient cooperative.",
        },
        dressing: {
          completed: true,
          assistanceLevel: "moderate",
          time: getTimeWithDate(0, 7, 45),
          notes: "Upper body - minimal assist. Lower body - moderate assist.",
        },
        toileting: {
          completed: true,
          assistanceLevel: "minimal",
          time: getTimeWithDate(0, 6, 45),
          notes: "Transfer with gait belt.",
        },
        eating: {
          completed: true,
          assistanceLevel: "independent",
          mealType: "Breakfast",
          amountConsumed: "100%",
          time: getTimeWithDate(0, 8, 0),
          notes: "Ate well. No difficulty swallowing.",
        },
        mobility: {
          completed: true,
          assistanceLevel: "independent",
          distance: "N/A",
          time: getTimeWithDate(0, 9, 0),
          notes:
            "Independent wheelchair mobility. Propels self throughout unit.",
        },
        positioning: {
          completed: true,
          time: getTimeWithDate(0, 10, 0),
          notes:
            "Pressure relief - repositioned. Skin check: no redness noted.",
        },
      },
      vitalSigns: {
        bloodPressure: {
          systolic: 118,
          diastolic: 74,
          time: getTimeWithDate(0, 8, 0),
        },
        heartRate: {
          value: 70,
          time: getTimeWithDate(0, 8, 0),
        },
        temperature: {
          value: 98.4,
          unit: "F",
          time: getTimeWithDate(0, 8, 0),
        },
      },
      recordedBy: caregiverIds[0],
    },

    // Harold Martinez - Today Afternoon Shift
    {
      patientId: patientIds[3],
      date: getDateDaysAgo(0),
      shift: "afternoon",
      activities: {
        toileting: {
          completed: true,
          assistanceLevel: "minimal",
          time: getTimeWithDate(0, 14, 0),
        },
        eating: {
          completed: true,
          assistanceLevel: "independent",
          mealType: "Lunch",
          amountConsumed: "90%",
          time: getTimeWithDate(0, 12, 30),
        },
        mobility: {
          completed: true,
          assistanceLevel: "independent",
          distance: "N/A",
          time: getTimeWithDate(0, 15, 0),
          notes:
            "Participated in group activity. Wheeled self to activity room.",
        },
        positioning: {
          completed: true,
          time: getTimeWithDate(0, 13, 0),
          notes: "Wheelchair cushion adjusted. Comfort maintained.",
        },
      },
      recordedBy: caregiverIds[1] || caregiverIds[0],
    },

    // Eleanor Thompson - Patient 4 - Today Morning Shift
    {
      patientId: patientIds[4],
      date: getDateDaysAgo(0),
      shift: "morning",
      activities: {
        bathing: {
          completed: true,
          assistanceLevel: "minimal",
          time: getTimeWithDate(0, 7, 30),
          notes: "Shower with assistance. Patient paced self well. No SOB.",
        },
        dressing: {
          completed: true,
          assistanceLevel: "supervision",
          time: getTimeWithDate(0, 8, 0),
          notes: "Dressed independently with supervision for safety.",
        },
        toileting: {
          completed: true,
          assistanceLevel: "independent",
          time: getTimeWithDate(0, 7, 0),
        },
        eating: {
          completed: true,
          assistanceLevel: "independent",
          mealType: "Breakfast",
          amountConsumed: "85%",
          time: getTimeWithDate(0, 8, 30),
          notes: "Good appetite. Low sodium diet.",
        },
        mobility: {
          completed: true,
          assistanceLevel: "minimal",
          distance: "50 feet",
          time: getTimeWithDate(0, 9, 30),
          notes:
            "Short walk in hallway. Patient tolerated well. Sat to rest after.",
        },
        positioning: {
          completed: true,
          time: getTimeWithDate(0, 10, 30),
          notes: "Positioned with legs elevated to reduce oedema.",
        },
      },
      vitalSigns: {
        bloodPressure: {
          systolic: 128,
          diastolic: 76,
          time: getTimeWithDate(0, 8, 0),
        },
        heartRate: {
          value: 74,
          time: getTimeWithDate(0, 8, 0),
        },
        temperature: {
          value: 98.0,
          unit: "F",
          time: getTimeWithDate(0, 8, 0),
        },
        oxygenSaturation: {
          value: 95,
          time: getTimeWithDate(0, 8, 0),
        },
      },
      recordedBy: caregiverIds[0],
    },

    // Eleanor Thompson - Today Evening Shift
    {
      patientId: patientIds[4],
      date: getDateDaysAgo(0),
      shift: "evening",
      activities: {
        toileting: {
          completed: true,
          assistanceLevel: "independent",
          time: getTimeWithDate(0, 18, 0),
        },
        eating: {
          completed: true,
          assistanceLevel: "independent",
          mealType: "Dinner",
          amountConsumed: "75%",
          time: getTimeWithDate(0, 17, 30),
          notes: "Fair appetite at dinner.",
        },
        positioning: {
          completed: true,
          time: getTimeWithDate(0, 19, 30),
          notes: "Prepared for bed. Oxygen setup for night.",
        },
      },
      vitalSigns: {
        bloodPressure: {
          systolic: 132,
          diastolic: 78,
          time: getTimeWithDate(0, 20, 0),
        },
        heartRate: {
          value: 72,
          time: getTimeWithDate(0, 20, 0),
        },
        oxygenSaturation: {
          value: 94,
          time: getTimeWithDate(0, 20, 0),
        },
      },
      recordedBy: caregiverIds[1] || caregiverIds[0],
    },

    // Yesterday Records - Margaret Johnson
    {
      patientId: patientIds[0],
      date: getDateDaysAgo(1),
      shift: "morning",
      activities: {
        bathing: {
          completed: true,
          assistanceLevel: "minimal",
          time: getTimeWithDate(1, 7, 30),
        },
        dressing: {
          completed: true,
          assistanceLevel: "supervision",
          time: getTimeWithDate(1, 8, 0),
        },
        toileting: {
          completed: true,
          assistanceLevel: "independent",
          time: getTimeWithDate(1, 7, 0),
        },
        eating: {
          completed: true,
          assistanceLevel: "independent",
          mealType: "Breakfast",
          amountConsumed: "90%",
          time: getTimeWithDate(1, 8, 30),
        },
        mobility: {
          completed: true,
          assistanceLevel: "supervision",
          distance: "40 feet",
          time: getTimeWithDate(1, 9, 30),
        },
      },
      vitalSigns: {
        bloodPressure: {
          systolic: 142,
          diastolic: 84,
          time: getTimeWithDate(1, 8, 0),
        },
        heartRate: {
          value: 78,
          time: getTimeWithDate(1, 8, 0),
        },
      },
      recordedBy: caregiverIds[1] || caregiverIds[0],
    },

    // Yesterday - Robert Chen
    {
      patientId: patientIds[1],
      date: getDateDaysAgo(1),
      shift: "morning",
      activities: {
        bathing: {
          completed: true,
          assistanceLevel: "moderate",
          time: getTimeWithDate(1, 7, 0),
        },
        dressing: {
          completed: true,
          assistanceLevel: "moderate",
          time: getTimeWithDate(1, 7, 45),
        },
        toileting: {
          completed: true,
          assistanceLevel: "minimal",
          time: getTimeWithDate(1, 6, 30),
        },
        eating: {
          completed: true,
          assistanceLevel: "supervision",
          mealType: "Breakfast",
          amountConsumed: "85%",
          time: getTimeWithDate(1, 8, 0),
        },
        mobility: {
          completed: true,
          assistanceLevel: "moderate",
          distance: "10 feet",
          time: getTimeWithDate(1, 9, 0),
        },
      },
      vitalSigns: {
        bloodPressure: {
          systolic: 124,
          diastolic: 74,
          time: getTimeWithDate(1, 8, 0),
        },
        bloodGlucose: {
          value: 138,
          time: getTimeWithDate(1, 7, 30),
        },
      },
      recordedBy: caregiverIds[0],
    },
  ];

  try {
    await ADLRecordModel.deleteMany();
    await ADLRecordModel.insertMany(adlRecords);
    console.log(
      `ADL records seeded successfully.`
    );
  } catch (error) {
    console.log("An error occurred while seeding ADL records: " + error);
    throw error;
  }
}

module.exports = {
  seedADLs
};
