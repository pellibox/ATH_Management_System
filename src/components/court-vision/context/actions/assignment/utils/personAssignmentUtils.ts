import { PersonData } from "../../../../types";

/**
 * Prepares a person object for assignment to a court, setting relevant properties
 */
export const preparePersonAssignment = (
  person: PersonData,
  courtId: string,
  position?: { x: number; y: number },
  timeSlot?: string,
  timeSlots?: string[]
): PersonData => {
  let durationHours = person.durationHours || 1;
  let endTimeSlot = timeSlot;

  if (timeSlot && timeSlots) {
    const startIndex = timeSlots.indexOf(timeSlot);
    const endIndex = startIndex + durationHours * 2 - 1; // Assuming 30 min slots
    endTimeSlot = timeSlots[endIndex] || timeSlots[timeSlots.length - 1];
  }

  return {
    ...person,
    courtId,
    position,
    timeSlot,
    endTimeSlot,
    sourceTimeSlot: person.timeSlot,
  };
};

/**
 * Removes a person from their source court or available list
 */
export const removePersonFromSource = (
  courts: any[],
  person: PersonData,
  sourceTimeSlot?: string,
  sourceCourtId?: string
): any[] => {
  if (!sourceTimeSlot && !sourceCourtId) {
    return courts;
  }

  return courts.map((court) => {
    if (court.id === sourceCourtId) {
      return {
        ...court,
        occupants: court.occupants.filter(
          (occupant: PersonData) =>
            occupant.id !== person.id || occupant.timeSlot !== sourceTimeSlot
        ),
      };
    }
    return court;
  });
};

/**
 * Adds a person to the specified court
 */
export const addPersonToCourt = (
  courts: any[],
  courtId: string,
  person: PersonData
): any[] => {
  return courts.map((court) => {
    if (court.id === courtId) {
      return {
        ...court,
        occupants: [...court.occupants, person],
      };
    }
    return court;
  });
};

/**
 * Checks if a coach is already assigned to another court at the specified time
 * 
 * @param courts Current courts data
 * @param coachId The ID of the coach to check
 * @param targetCourtId The court ID we want to assign the coach to
 * @param timeSlot The time slot we want to assign the coach to
 * @returns Either false (no overlap) or an object with details about the overlap
 */
export const checkCoachOverlap = (
  courts: any[],
  coachId: string,
  targetCourtId: string,
  timeSlot: string
) => {
  // Loop through all courts except the target court
  for (const court of courts) {
    if (court.id === targetCourtId) continue;
    
    // Check if the coach is already assigned to this court at the same time slot
    const existingAssignment = court.occupants.find(
      (person: any) => 
        person.id === coachId && 
        person.type === "coach" && 
        (person.timeSlot === timeSlot || 
          (person.timeSlot && person.endTimeSlot && 
            timeSlot >= person.timeSlot && timeSlot <= person.endTimeSlot))
    );
    
    if (existingAssignment) {
      return {
        courtId: court.id,
        timeSlot,
        coachId
      };
    }
  }
  
  return false;
};
