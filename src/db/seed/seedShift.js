const { ShiftModel } = require("../../models/shiftModel");
const { AppError } = require("../../functions/helperFunctions.js");

async function seedShifts(caregiverIds, patientIds) {
  if (!caregiverIds || caregiverIds.length === 0) {
    throw new AppError("No caregiver IDs provided", 400);
  }
  if (!patientIds || patientIds.length === 0) {
    throw new AppError("No patient IDs provided", 400);
  }

  // Helper function to create dates
  const getDateDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getDateDaysAhead = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getClockTime = (days, hour, minute = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const shifts = [
    // ========== COMPLETED SHIFTS (Past) ==========

    // Yesterday - Margaret Johnson (Patient 0)
    {
      patientId: patientIds[0],
      caregiverId: caregiverIds[0],
      date: getDateDaysAgo(1),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: getClockTime(1, 7, 55),
      actualClockOut: getClockTime(1, 16, 10),
      status: "completed",
    },
    {
      patientId: patientIds[0],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(1),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: getClockTime(1, 16, 5),
      actualClockOut: getClockTime(1, 0, 5),
      status: "completed",
    },

    // Yesterday - Robert Chen (Patient 1)
    {
      patientId: patientIds[1],
      caregiverId: caregiverIds[0],
      date: getDateDaysAgo(1),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: getClockTime(1, 8, 0),
      actualClockOut: getClockTime(1, 16, 0),
      status: "completed",
    },
    {
      patientId: patientIds[1],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(1),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: getClockTime(1, 16, 10),
      actualClockOut: getClockTime(1, 0, 0),
      status: "completed",
    },

    // Yesterday - Dorothy Williams (Patient 2)
    {
      patientId: patientIds[2],
      caregiverId: caregiverIds[0],
      date: getDateDaysAgo(1),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: getClockTime(1, 7, 50),
      actualClockOut: getClockTime(1, 16, 15),
      status: "completed",
    },
    {
      patientId: patientIds[2],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(1),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: getClockTime(1, 16, 0),
      actualClockOut: getClockTime(1, 0, 10),
      status: "completed",
    },

    // Yesterday - Harold Martinez (Patient 3)
    {
      patientId: patientIds[3],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(1),
      shiftType: "afternoon",
      scheduledStart: "12:00",
      scheduledEnd: "20:00",
      actualClockIn: getClockTime(1, 12, 5),
      actualClockOut: getClockTime(1, 20, 0),
      status: "completed",
    },

    // Yesterday - Eleanor Thompson (Patient 4)
    {
      patientId: patientIds[4],
      caregiverId: caregiverIds[0],
      date: getDateDaysAgo(1),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: getClockTime(1, 8, 5),
      actualClockOut: getClockTime(1, 16, 5),
      status: "completed",
    },

    // 2 Days Ago - Margaret Johnson
    {
      patientId: patientIds[0],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(2),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: getClockTime(2, 8, 10),
      actualClockOut: getClockTime(2, 16, 0),
      status: "completed",
    },

    // ========== IN-PROGRESS SHIFTS (Today) ==========

    // Today - Margaret Johnson
    {
      patientId: patientIds[0],
      caregiverId: caregiverIds[0],
      date: getDateDaysAgo(0),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: getClockTime(0, 8, 0),
      actualClockOut: null,
      status: "in-progress",
    },

    // Today - Robert Chen
    {
      patientId: patientIds[1],
      caregiverId: caregiverIds[0],
      date: getDateDaysAgo(0),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: getClockTime(0, 7, 55),
      actualClockOut: null,
      status: "in-progress",
    },

    // Today - Dorothy Williams
    {
      patientId: patientIds[2],
      caregiverId: caregiverIds[0],
      date: getDateDaysAgo(0),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: getClockTime(0, 8, 5),
      actualClockOut: null,
      status: "in-progress",
      notes: null,
    },

    // Today Evening - Scheduled
    {
      patientId: patientIds[0],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(0),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },
    {
      patientId: patientIds[1],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(0),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },
    {
      patientId: patientIds[2],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(0),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },

    // Today - Harold Martinez
    {
      patientId: patientIds[3],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(0),
      shiftType: "afternoon",
      scheduledStart: "12:00",
      scheduledEnd: "20:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },

    // Today - Eleanor Thompson
    {
      patientId: patientIds[4],
      caregiverId: caregiverIds[0],
      date: getDateDaysAgo(0),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: getClockTime(0, 8, 10),
      actualClockOut: null,
      status: "in-progress",
    },

    // ========== FUTURE SCHEDULED SHIFTS ==========

    // Tomorrow - Margaret Johnson
    {
      patientId: patientIds[0],
      caregiverId: caregiverIds[0],
      date: getDateDaysAhead(1),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },
    {
      patientId: patientIds[0],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAhead(1),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },

    // Tomorrow - Robert Chen
    {
      patientId: patientIds[1],
      caregiverId: caregiverIds[0],
      date: getDateDaysAhead(1),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },
    {
      patientId: patientIds[1],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAhead(1),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },

    // Tomorrow - Dorothy Williams
    {
      patientId: patientIds[2],
      caregiverId: caregiverIds[0],
      date: getDateDaysAhead(1),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },
    {
      patientId: patientIds[2],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAhead(1),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },

    // Tomorrow - Harold Martinez
    {
      patientId: patientIds[3],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAhead(1),
      shiftType: "afternoon",
      scheduledStart: "12:00",
      scheduledEnd: "20:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },

    // Tomorrow - Eleanor Thompson
    {
      patientId: patientIds[4],
      caregiverId: caregiverIds[0],
      date: getDateDaysAhead(1),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },
    {
      patientId: patientIds[4],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAhead(1),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },

    // Day After Tomorrow - Selected Shifts
    {
      patientId: patientIds[0],
      caregiverId: caregiverIds[0],
      date: getDateDaysAhead(2),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },
    {
      patientId: patientIds[1],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAhead(2),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },
    {
      patientId: patientIds[2],
      caregiverId: caregiverIds[0],
      date: getDateDaysAhead(2),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },

    // 3 Days Ahead
    {
      patientId: patientIds[0],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAhead(3),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
      notes: null,
    },
    {
      patientId: patientIds[3],
      caregiverId: caregiverIds[0],
      date: getDateDaysAhead(3),
      shiftType: "afternoon",
      scheduledStart: "12:00",
      scheduledEnd: "20:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },
    {
      patientId: patientIds[4],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAhead(3),
      shiftType: "morning",
      scheduledStart: "08:00",
      scheduledEnd: "16:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "scheduled",
    },

    // ========== CANCELLED/NO-SHOW EXAMPLES ==========

    // 3 Days Ago - Cancelled shift
    {
      patientId: patientIds[2],
      caregiverId: caregiverIds[1] || caregiverIds[0],
      date: getDateDaysAgo(3),
      shiftType: "evening",
      scheduledStart: "16:00",
      scheduledEnd: "00:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "cancelled",
    },

    // 4 Days Ago - No-show
    {
      patientId: patientIds[3],
      caregiverId: caregiverIds[0],
      date: getDateDaysAgo(4),
      shiftType: "afternoon",
      scheduledStart: "12:00",
      scheduledEnd: "20:00",
      actualClockIn: null,
      actualClockOut: null,
      status: "no-show",
    }
  ];

  try {
    await ShiftModel.deleteMany();
    await ShiftModel.insertMany(shifts);
    console.log(
      `Shifts seeded successfully.`
    );
  } catch (error) {
    console.log("An error occurred while seeding shifts: " + error);
    throw error;
  }
}

module.exports = {
  seedShifts,
};
