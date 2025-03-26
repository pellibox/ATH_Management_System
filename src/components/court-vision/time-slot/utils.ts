
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

// Calculate max program duration for a court with multiple players
export const calculateMaxProgramDuration = (
  courtId: string,
  timeSlot: string,
  courts: any[]
): number => {
  const court = courts.find(c => c.id === courtId);
  if (!court) return 1;
  
  // Find all players assigned to this time slot
  const playersInSlot = court.occupants.filter(
    (p: PersonData) => p.type === "player" && p.timeSlot === timeSlot
  );
  
  if (playersInSlot.length === 0) return 1;
  
  // Get the maximum program duration among these players
  return Math.max(
    ...playersInSlot.map((player: PersonData) => calculateProgramDuration(player))
  );
};
