const { HandoverModel } = require('../../models/handoverNotesModel');
const mongoose = require("mongoose");

async function seedHandoverNotes(userIds, patientIds){
    if (!userIds || userIds.length === 0){
        throw new Error("No user ID provided.")
    }

    if (!patientIds || patientIds.length === 0){
      throw new Error("No patient ID providied.");
    }
    
    const HandoverEntries = [
    {
      user: userIds[0],
      patient: patientIds[0], // Margaret Johnson
      title: "Morning Shift - Medication Reminder",
      content: "Margaret was alert and cooperative this morning. Administered blood pressure medication at 8:00 AM with breakfast. She mentioned feeling a bit dizzy after standing, so reminded her to call for assistance before getting up. Blood pressure: 138/82.",
      tags: ["medication", "morning", "vital-signs"]
    },
    {
      user: userIds[0],
      patient: patientIds[0], // Margaret Johnson
      title: "Fall Risk Assessment",
      content: "During afternoon rounds, noticed Margaret attempting to reach for items on high shelf without her walker. Repositioned frequently used items within easy reach. Reinforced importance of using call button. Family has been notified.",
      tags: ["safety", "fall-risk", "afternoon"]
    },
    {
      user: userIds[1] || userIds[0],
      patient: patientIds[1], // Robert Chen
      title: "Blood Sugar Monitoring",
      content: "Pre-lunch blood glucose reading: 142 mg/dL. Slightly elevated but within acceptable range. Robert ate 80% of lunch. Insulin administered as per care plan. Will monitor at dinner time.",
      tags: ["diabetes", "medication", "lunch", "vital-signs"]
    },
    {
      user: userIds[0],
      patient: patientIds[1], // Robert Chen
      title: "Mobility Concerns",
      content: "Robert requested assistance with transfers today more than usual. Reports left knee pain (4/10). Applied ice pack as ordered. Physio appointment scheduled for tomorrow. Monitor for increased pain or swelling.",
      tags: ["mobility", "pain-management", "follow-up"]
    },
    {
      user: userIds[1] || userIds[0],
      patient: patientIds[2], // Dorothy Williams
      title: "Evening Confusion Episode",
      content: "Dorothy became disoriented around 6:00 PM, asking for her late mother. Used redirection and reminiscence therapy - showed family photos which helped calm her. Episode lasted approximately 20 minutes. Night staff should be aware of increased sundowning behavior.",
      tags: ["dementia", "behavior", "evening", "sundowning"]
    },
    {
      user: userIds[0],
      patient: patientIds[2], // Dorothy Williams
      title: "Wandering Prevention Update",
      content: "Door alarm system checked and functioning properly. Dorothy attempted to leave unit twice during shift but responded well to redirection. Engaged her in folding activity which she enjoyed for 45 minutes. Family visiting tomorrow at 2:00 PM.",
      tags: ["wandering", "safety", "activities"]
    },
    {
      user: userIds[1] || userIds[0],
      patient: patientIds[3], // Harold Martinez
      title: "Hearing Aid Maintenance",
      content: "Harold's hearing aid was not working this morning - battery needed replacement. New battery installed and tested. Communication much improved. Reminded Harold about weekly cleaning routine.",
      tags: ["hearing-aid", "communication", "maintenance"]
    },
    {
      user: userIds[0],
      patient: patientIds[3], // Harold Martinez
      title: "Wheelchair Positioning",
      content: "Physical therapist adjusted wheelchair cushion for better pressure relief. Harold reports improved comfort. Skin check performed - no pressure areas noted. Continue current repositioning schedule every 2 hours.",
      tags: ["wheelchair", "pressure-care", "comfort"]
    },
    {
      user: userIds[1] || userIds[0],
      patient: patientIds[4], // Eleanor Thompson
      title: "Oxygen Saturation Monitoring",
      content: "Evening oxygen saturation levels: 94% on 2L O2 via nasal cannula. Eleanor reports breathing comfortably. No signs of respiratory distress. Oxygen concentrator functioning properly. Night oxygen increased to 3L as per care plan.",
      tags: ["oxygen", "respiratory", "evening", "vital-signs"]
    },
    {
      user: userIds[0],
      patient: patientIds[4], // Eleanor Thompson
      title: "Cardiac Medication Administration",
      content: "All cardiac medications administered as scheduled. Eleanor tolerated medications well with no adverse effects. Heart rate: 76 bpm, regular rhythm. She walked 50 feet in hallway with minimal assistance. Appetite good at dinner.",
      tags: ["cardiac", "medication", "mobility", "vital-signs"]
    },
    {
      user: userIds[1] || userIds[0],
      patient: patientIds[0], // Margaret Johnson
      title: "Family Meeting Notes",
      content: "Daughter Sarah visited and expressed concerns about mother's declining appetite. Discussed meal preferences and agreed to try smaller, more frequent meals. Dietitian consult requested. Follow-up meeting scheduled for next week.",
      tags: ["family", "nutrition", "follow-up"]
    },
    {
      user: userIds[0],
      patient: patientIds[2], // Dorothy Williams
      title: "Activity Participation",
      content: "Dorothy attended music therapy session this afternoon. She was engaged and seemed to enjoy singing familiar songs from the 1960s. Remained calm and oriented throughout the 45-minute session. Recommend continuing daily structured activities.",
      tags: ["activities", "dementia", "therapy", "afternoon"]
    },
    {
      user: userIds[1] || userIds[0],
      patient: patientIds[1], // Robert Chen
      title: "Dietary Restrictions Reminder",
      content: "Kitchen staff reminded about Robert's diabetic diet requirements. His wife Linda brought in sugar-free snacks which have been labeled and stored appropriately. Blood sugar levels stable throughout the day.",
      tags: ["diabetes", "diet", "family"]
    },
    {
      user: userIds[0],
      patient: patientIds[3], // Harold Martinez
      title: "Transportation Arrangement",
      content: "Harold has cardiology appointment next Tuesday at 10:00 AM. Medical transport arranged. Daughter Rosa will meet him there. Appointment card placed in visible location. Remember to send current medication list.",
      tags: ["appointments", "transportation", "follow-up"]
    },
    {
      user: userIds[1] || userIds[0],
      patient: patientIds[4], // Eleanor Thompson
      title: "Night Routine Adjustment",
      content: "Eleanor reports difficulty sleeping. Discussed relaxation techniques and adjusted bedtime routine. Warm milk at 9:00 PM, light reading, oxygen increased to 3L at bedtime. Will monitor sleep patterns over next few nights.",
      tags: ["sleep", "night", "oxygen", "comfort"]
    }
  ];

    try {
        await HandoverModel.deleteMany();
        await HandoverModel.insertMany(HandoverEntries);
        console.log("Handover entries seeded successfully.");
    } catch (error) {
        console.log("An error occurred while seeding the handover entries: " + error);
        throw error;
    }
}

module.exports = {
    seedHandoverNotes
}