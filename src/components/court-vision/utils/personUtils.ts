
import { PersonData, Program } from "../types";

/**
 * Gets the primary program color for a person, or a default color based on their type
 */
export function getPersonProgramColor(person: PersonData): string {
  // Use assigned program color if available
  if (person.programColor) {
    return person.programColor;
  }
  
  // Fallback to default colors based on type
  return person.type === "coach" ? "#b00c20" : "#3b82f6";
}

/**
 * Checks if a person is marked as unavailable
 */
export function isPersonUnavailable(person: PersonData): boolean {
  return person.isPresent === false;
}

/**
 * Gets the assigned programs for a person from the program list
 */
export function getAssignedPrograms(person: PersonData, allPrograms: Program[]): Program[] {
  if (!person.programIds && !person.programId) {
    return [];
  }
  
  // Use programIds array if available
  if (person.programIds && person.programIds.length > 0) {
    return allPrograms.filter(program => 
      person.programIds!.includes(program.id)
    );
  }
  
  // Fallback to single programId
  if (person.programId) {
    const program = allPrograms.find(p => p.id === person.programId);
    return program ? [program] : [];
  }
  
  return [];
}

/**
 * Gets the program-based default duration for a person
 */
export function getProgramBasedDuration(person: PersonData): number {
  if (!person.programId) return 1;
  
  // Program-specific durations
  const programDurations: Record<string, number> = {
    "perf2": 1.5,
    "perf3": 1.5,
    "perf4": 1.5,
    "elite": 1.5,
    "elite-full": 2,
    "junior-sit": 1,
    "junior-sat": 1,
  };
  
  return programDurations[person.programId] || 1;
}

/**
 * Gets the program-based daily limits for a person
 */
export function getProgramBasedDailyLimit(person: PersonData): number {
  if (!person.programId) return 2;
  
  // Program-specific daily limits
  const programLimits: Record<string, number> = {
    "perf2": 3,
    "perf3": 4.5,
    "perf4": 6,
    "elite": 7.5,
    "elite-full": 10,
    "junior-sit": 3,
    "junior-sat": 1.5,
  };
  
  return programLimits[person.programId] || 2;
}

/**
 * Calculates remaining hours for a player based on their program
 */
export function getRemainingHours(person: PersonData): number {
  if (person.type !== "player") return 0;
  
  const dailyLimit = getProgramBasedDailyLimit(person);
  const usedHours = person.hoursAssigned || 0;
  
  return Math.max(0, dailyLimit - usedHours);
}

/**
 * Checks if a player has exceeded their daily hour limit
 */
export function hasExceededDailyLimit(person: PersonData): boolean {
  if (person.type !== "player") return false;
  
  return getRemainingHours(person) <= 0;
}
