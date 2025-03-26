
import { PersonData } from "../types";
import { programDetailsMap } from "@/types/player/programs";

export const calculateProgramDuration = (person: PersonData): number => {
  if (!person.programId) return 1; // Default duration
  
  // Get program details from the player's assigned program
  const program = programDetailsMap[person.programId];
  if (!program) return 1;
  
  return program.hoursPerSession || 1;
};

export const calculateTimeSlotSpan = (
  startTimeSlot: string,
  duration: number,
  timeSlots: string[]
): string | undefined => {
  const startIndex = timeSlots.indexOf(startTimeSlot);
  if (startIndex === -1) return undefined;
  
  // Calculate how many slots we need (2 slots per hour)
  const slotsNeeded = Math.ceil(duration * 2);
  const endIndex = startIndex + slotsNeeded - 1;
  
  if (endIndex >= timeSlots.length) return undefined;
  return timeSlots[endIndex];
};
