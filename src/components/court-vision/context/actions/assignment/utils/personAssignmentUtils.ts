
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
    durationHours: person.durationHours || getProgramDuration(person),
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
 * Get program-based duration for a person
 */
export const getProgramDuration = (person: PersonData): number => {
  // This would come from actual program data in a real implementation
  if (person.type === PERSON_TYPES.PLAYER) {
    if (person.programId === "pro") return 2;
    if (person.programId === "elite") return 1.5;
    if (person.programId === "junior") return 1;
    return 1; // Default for players
  } else {
    // Coaches use default duration
    return 1;
  }
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
