import { PersonData } from "../../../../types";
import { PERSON_TYPES } from "../../../../constants";

/**
 * Prepare a person object with court info for assignment
 */
export const preparePersonAssignment = (
  person: PersonData,
  courtId: string,
  position?: { x: number, y: number },
  timeSlot?: string,
  timeSlots?: string[]
): PersonData => {
  // Start with basic person data
  const personWithCourtInfo: PersonData = {
    ...person,
    courtId,
    position: position // Store position as a single property
  };

  // Handle time slot assignment
  if (timeSlot) {
    personWithCourtInfo.timeSlot = timeSlot;
    
    // Calculate end time slot if person has duration and timeSlots is provided
    if (person.durationHours && person.durationHours > 0 && timeSlots && timeSlots.length > 0) {
      const slotIndex = timeSlots.indexOf(timeSlot);
      if (slotIndex !== -1) {
        // Calculate how many slots we need based on duration hours
        // Each hour typically consists of 2 slots (30 min each)
        const slotsNeeded = Math.round(person.durationHours * 2);
        const endSlotIndex = Math.min(slotIndex + slotsNeeded - 1, timeSlots.length - 1);
        personWithCourtInfo.endTimeSlot = timeSlots[endSlotIndex];
      }
    }
  }

  // Always ensure coaches have a duration set
  if (person.type === PERSON_TYPES.COACH && !personWithCourtInfo.durationHours) {
    personWithCourtInfo.durationHours = 1;
  }

  return personWithCourtInfo;
};

/**
 * Remove a person from their source location
 */
export const removePersonFromSource = (
  courts: any[],
  person: PersonData,
  sourceTimeSlot?: string,
  sourceCourtId?: string
): any[] => {
  if (!sourceCourtId) return courts;

  return courts.map(court => {
    if (court.id !== sourceCourtId) return court;

    return {
      ...court,
      occupants: court.occupants.filter(
        (p: PersonData) => !(p.id === person.id && 
          (p.timeSlot === sourceTimeSlot || !sourceTimeSlot)
        )
      )
    };
  });
};

/**
 * Add a person to a court
 */
export const addPersonToCourt = (
  courts: any[],
  courtId: string,
  person: PersonData
): any[] => {
  return courts.map(court => {
    if (court.id !== courtId) return court;

    // For coaches, we might already have this coach in the court
    // Check if we need to update an existing assignment or add a new one
    if (person.type === PERSON_TYPES.COACH) {
      const existingCoachIndex = court.occupants.findIndex(
        (p: PersonData) => p.id === person.id && p.timeSlot === person.timeSlot
      );

      if (existingCoachIndex !== -1) {
        // Update existing coach assignment
        const updatedOccupants = [...court.occupants];
        updatedOccupants[existingCoachIndex] = person;
        return {
          ...court,
          occupants: updatedOccupants
        };
      }
    }

    // Otherwise add as a new occupant
    return {
      ...court,
      occupants: [...court.occupants, person]
    };
  });
};
