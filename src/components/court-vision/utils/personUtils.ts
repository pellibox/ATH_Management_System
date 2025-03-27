
import { PersonData, Program, ActivityData } from "../types";

// Program color map for consistent colors
const PROGRAM_COLORS: Record<string, string> = {
  "perf2": "#3b82f6", // Blue
  "perf3": "#8b5cf6", // Purple
  "perf4": "#6366f1", // Indigo
  "elite": "#ec4899", // Pink
  "elite-full": "#d946ef", // Fuchsia
  "junior-sit": "#f59e0b", // Amber 
  "junior-sat": "#84cc16", // Lime
  "default-coach": "#b00c20", // Red
  "default-player": "#3b82f6" // Blue
};

/**
 * Gets the primary program color for a person, or a default color based on their type
 */
export function getPersonProgramColor(person: PersonData): string {
  // Use assigned program color if available
  if (person.programColor) {
    return person.programColor;
  }
  
  // Use color from program ID if available
  if (person.programId && PROGRAM_COLORS[person.programId]) {
    return PROGRAM_COLORS[person.programId];
  }
  
  // Fallback to default colors based on type
  return person.type === "coach" ? PROGRAM_COLORS["default-coach"] : PROGRAM_COLORS["default-player"];
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
  
  const dailyLimit = person.dailyLimit || getProgramBasedDailyLimit(person);
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

/**
 * Gets CSS classes for program-based styling
 */
export function getProgramClasses(person: PersonData): string {
  if (!person.programId) return "";
  
  return `program-border-${person.programId}`;
}

/**
 * Gets status-based styling classes
 */
export function getStatusClasses(person: PersonData): string {
  switch (person.status) {
    case "confirmed":
      return "border-green-400";
    case "pending":
      return "border-amber-400 bg-stripes";
    case "conflict":
      return "border-orange-400 animate-pulse-border";
    default:
      return "border-gray-300";
  }
}

/**
 * Checks if a coach assignment is valid (covers all player times)
 */
export function isCoachAssignmentValid(coach: PersonData, players: PersonData[]): boolean {
  if (coach.type !== "coach" || players.length === 0) return true;
  
  // Get coach time range
  const coachStart = coach.timeSlot;
  const coachEnd = coach.endTimeSlot;
  
  if (!coachStart) return false;
  
  // Check if coach covers all players
  for (const player of players) {
    if (player.type !== "player" || !player.timeSlot) continue;
    
    const playerStart = player.timeSlot;
    const playerEnd = player.endTimeSlot || playerStart;
    
    // Coach must start at or before player
    if (coachStart > playerStart) return false;
    
    // Coach must end at or after player
    if (coachEnd && playerEnd && coachEnd < playerEnd) return false;
  }
  
  return true;
}

/**
 * Calculate health score for a set of assignments
 * Returns a percentage (0-100) representing compliance with rules
 */
export function calculateHealthScore(
  people: PersonData[], 
  activities: ActivityData[],
  rules: any[] // ValidationRule[] in a real implementation
): number {
  // If no assignments, return 100%
  if (people.length === 0 && activities.length === 0) return 100;
  
  // Count rule violations
  let totalChecks = 0;
  let passedChecks = 0;
  
  // For now, simplified implementation:
  // 1. Check if any coach has conflicts
  // 2. Check if any player is over daily limit
  
  const coachesWithConflicts = people.filter(p => 
    p.type === "coach" && p.status === "conflict"
  ).length;
  
  const playersOverLimit = people.filter(p => 
    p.type === "player" && hasExceededDailyLimit(p)
  ).length;
  
  totalChecks = people.filter(p => p.type === "coach").length + 
                people.filter(p => p.type === "player").length;
  
  passedChecks = totalChecks - (coachesWithConflicts + playersOverLimit);
  
  // Calculate percentage
  return Math.round((passedChecks / totalChecks) * 100);
}
