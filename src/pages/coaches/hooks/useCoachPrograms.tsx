
import { useState } from "react";
import { Program } from "@/components/court-vision/types";
import { EXCLUDED_PROGRAMS, EXCLUDED_PROGRAM_NAMES } from "@/contexts/programs/useProgramsState";

export function useCoachPrograms() {
  // Handle assigning a program to a coach (supporting multiple programs)
  const handleAssignProgram = (coachId: string, programId: string) => {
    // Non permettere l'assegnazione di programmi esclusi
    if (EXCLUDED_PROGRAMS.includes(programId)) {
      console.log(`Programma ${programId} è escluso e non può essere assegnato`);
      return;
    }
    
    // This will be implemented in the parent component (was already moved out)
    // The parent component will pass a function to handle this
  };

  // Handle sending a schedule to a coach
  const handleSendSchedule = (coachId: string, type: "day" | "week" | "month") => {
    // Implementation retained from original component
    // In the original this was empty, just kept for interface compatibility
  };

  // Filtered programs (just returning the filtering logic)
  const getFilteredPrograms = (programs: Program[]) => {
    return programs.filter(program => 
      !EXCLUDED_PROGRAMS.includes(program.id) && 
      !EXCLUDED_PROGRAM_NAMES.includes(program.name)
    );
  };

  return {
    handleAssignProgram,
    handleSendSchedule,
    filteredPrograms: getFilteredPrograms
  };
}
