
import { PersonData, Program } from "../types";
import { getProgramColor } from "@/components/players/utils/programUtils";

/**
 * Get the color for a person's program border
 */
export function getPersonProgramColor(person: PersonData): string {
  // First try to use the same utility function as in PlayerRow for consistency
  if (person.program) {
    return getProgramColor(person.program);
  }
  
  // Use programColor if directly available on the person
  if (person.programColor) {
    return person.programColor;
  }
  
  // Fall back to default color if no program info available
  return "#e0e0e0";
}

/**
 * Get an array of all assigned programs for a person
 */
export function getAssignedPrograms(person: PersonData, programs: Program[]): Program[] {
  if (!programs || !programs.length) {
    return [];
  }
  
  // If person has programIds array (for multiple programs)
  if (person.programIds && person.programIds.length > 0) {
    return person.programIds
      .map(id => programs.find(p => p.id === id))
      .filter(p => p !== undefined) as Program[];
  }
  
  // If person has a single programId
  if (person.programId) {
    const program = programs.find(p => p.id === person.programId);
    return program ? [program] : [];
  }
  
  // If person has a program name, match it by name
  if (person.program) {
    const program = programs.find(p => p.name === person.program);
    return program ? [program] : [];
  }
  
  return [];
}

/**
 * Check if a person (especially coach) is unavailable
 */
export function isPersonUnavailable(person: PersonData): boolean {
  return person.isPresent === false;
}
