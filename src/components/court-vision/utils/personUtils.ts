
import { PersonData, Program } from "../types";
import { getProgramColor } from "@/components/players/utils/programUtils";

/**
 * Determines the program color for a person based on their assigned program(s)
 */
export const getPersonProgramColor = (person: PersonData): string => {
  return person.programId 
    ? getProgramColor(person.programId)
    : (person.programIds && person.programIds.length > 0 
      ? getProgramColor(person.programIds[0]) 
      : "#e0e0e0");
};

/**
 * Gets all valid programs assigned to a person
 */
export const getAssignedPrograms = (person: PersonData, programs: Program[]): Program[] => {
  const assignedPrograms = person.programIds 
    ? programs.filter(p => person.programIds?.includes(p.id))
    : person.programId 
      ? [programs.find(p => p.id === person.programId)] 
      : [];
      
  // Filter out undefined programs
  return assignedPrograms.filter(Boolean) as Program[];
};

/**
 * Checks if a person is unavailable (not present)
 */
export const isPersonUnavailable = (person: PersonData): boolean => {
  return person.isPresent === false;
};
