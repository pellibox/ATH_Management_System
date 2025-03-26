import { PersonData } from "../../../../types";
import { PERSON_TYPES } from "../../../../constants";
import { calculateTimeSlotSpan } from "../../../../time-slot/utils";

/**
 * Process a person assignment, handling time slots, positions, and metadata
 */
export const preparePersonAssignment = (
  person: PersonData,
  courtId: string,
  position?: { x: number, y: number },
  timeSlot?: string,
  timeSlots?: string[]
): PersonData => {
  // Create a deep copy of the person object to avoid reference issues
  const personWithCourtInfo = { 
    ...JSON.parse(JSON.stringify(person)), 
    courtId,
    position: position || { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.8 + 0.1 },
    date: new Date().toISOString().split('T')[0],
    durationHours: person.durationHours || 1,
    programColor: person.programColor || (person.type === PERSON_TYPES.PLAYER ? "#3b82f6" : "#ef4444")
  };

  // IMPORTANT: Set the timeSlot if explicitly provided in the drop
  if (timeSlot) {
    console.log(`Setting timeSlot to ${timeSlot} for ${person.name}`);
    personWithCourtInfo.timeSlot = timeSlot;
    
    // Calculate end time slot if duration > 1 or has fractional hours (like 1.5)
    if (personWithCourtInfo.durationHours !== 1 && timeSlots) {
      const endTimeSlot = calculateTimeSlotSpan(
        timeSlot,
        personWithCourtInfo.durationHours,
        timeSlots
      );
      
      if (endTimeSlot) {
        personWithCourtInfo.endTimeSlot = endTimeSlot;
        console.log(`Setting endTimeSlot to ${endTimeSlot} (spanning ${personWithCourtInfo.durationHours} hours)`);
      }
    }
  }

  return personWithCourtInfo;
};

/**
 * Create updated courts array with person removed from source
 */
export const removePersonFromSource = (
  courts: any[],
  person: PersonData,
  sourceTimeSlot?: string,
  sourceCourtId?: string
): any[] => {
  if (!sourceTimeSlot && !sourceCourtId) return [...courts];
  
  // Create a new courts array
  let updatedCourts = JSON.parse(JSON.stringify(courts));

  // Handle removal for both player and coach types similarly - remove only from specific time slot
  if (sourceTimeSlot && sourceCourtId) {
    updatedCourts = updatedCourts.map((court: any) => {
      if (court.id === sourceCourtId) {
        return {
          ...court,
          occupants: court.occupants.filter((p: PersonData) => 
            !(p.id === person.id && p.timeSlot === sourceTimeSlot)
          )
        };
      }
      return court;
    });
  } else {
    // For layout view (non-time-slot), remove from all time slots
    updatedCourts = updatedCourts.map((court: any) => {
      return {
        ...court,
        occupants: court.occupants.filter((p: PersonData) => p.id !== person.id)
      };
    });
  }

  return updatedCourts;
};

/**
 * Add person to target court
 */
export const addPersonToCourt = (
  courts: any[],
  courtId: string,
  personWithCourtInfo: PersonData
): any[] => {
  return courts.map((court: any) => {
    if (court.id === courtId) {
      return {
        ...court,
        occupants: [...court.occupants, personWithCourtInfo],
      };
    }
    return court;
  });
};

/**
 * Checks if a coach is already assigned to a different court at the same time slot
 * @param courts Array of courts
 * @param coachId ID of the coach to check
 * @param targetCourtId ID of the target court
 * @param timeSlot Time slot to check
 * @returns Object with overlap information or null if no overlap
 */
export const checkCoachOverlap = (
  courts: any[],
  coachId: string,
  targetCourtId: string,
  timeSlot: string
) => {
  // Look through all courts
  for (const court of courts) {
    // Skip the target court
    if (court.id === targetCourtId) continue;
    
    // Check occupants for this time slot
    for (const occupant of court.occupants || []) {
      if (occupant.id === coachId && occupant.type === "coach") {
        // If coach has a time slot, check if it's the same as the target time slot
        if (occupant.timeSlot === timeSlot) {
          return {
            courtId: court.id,
            timeSlot
          };
        }
        
        // If coach spans multiple time slots, check if target time slot is within the span
        if (occupant.timeSlot && occupant.endTimeSlot) {
          const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", 
                         "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
                         "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", 
                         "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
                         
          const slotIndex = timeSlots.indexOf(timeSlot);
          const startIndex = timeSlots.indexOf(occupant.timeSlot);
          const endIndex = timeSlots.indexOf(occupant.endTimeSlot);
          
          if (slotIndex >= startIndex && slotIndex <= endIndex) {
            return {
              courtId: court.id,
              timeSlot
            };
          }
        }
      }
    }
  }
  
  // No overlap found
  return null;
};
