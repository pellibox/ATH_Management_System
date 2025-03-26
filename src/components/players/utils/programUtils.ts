
import { DEFAULT_PROGRAMS } from "@/components/court-vision/constants";

export const getProgramColor = (program: string | undefined) => {
  if (!program) return "#e0e0e0"; // Default gray
  
  const foundProgram = DEFAULT_PROGRAMS.find(p => p.name === program || p.id === program);
  if (foundProgram) {
    return foundProgram.color;
  }
  
  const hash = program.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8B5CF6", "#EC4899"];
  return colors[hash % colors.length];
};

// New function to check if a coach's programs include the player's program
export const checkProgramCompatibility = (
  playerProgram: string | undefined, 
  coachPrograms: string[] | undefined
): boolean => {
  if (!playerProgram) return true; // Player has no program, any coach is compatible
  if (!coachPrograms || coachPrograms.length === 0) return false; // Coach has no programs
  
  return coachPrograms.includes(playerProgram);
};

// Get formatted program names from program IDs
export const getProgramNames = (programIds: string[] | undefined): string => {
  if (!programIds || programIds.length === 0) return "Nessun programma";
  
  const programNames = programIds.map(id => {
    const program = DEFAULT_PROGRAMS.find(p => p.id === id);
    return program ? program.name : id;
  });
  
  return programNames.join(", ");
};
