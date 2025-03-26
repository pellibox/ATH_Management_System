
import { PersonData } from "../../../types";
import { useToast } from "@/hooks/use-toast";
import { ProgramAssignmentProps } from "./types";

export const useProgramAssignment = ({
  playersList,
  setPlayersList,
  coachesList,
  setCoachesList,
  programs,
  courts
}: ProgramAssignmentProps) => {
  const { toast } = useToast();

  const handleAssignProgram = (personId: string, programId: string) => {
    // Update in playersList - now supporting multiple programs
    const updatedPlayersList = playersList.map(player => {
      if (player.id === personId) {
        // Initialize programIds array if it doesn't exist
        const currentProgramIds = player.programIds || [];
        
        // Add the program if not already assigned, otherwise remove it (toggle behavior)
        const newProgramIds = currentProgramIds.includes(programId)
          ? currentProgramIds.filter(id => id !== programId)
          : [...currentProgramIds, programId];
          
        const program = programs.find(p => p.id === programId);
        return { 
          ...player, 
          programIds: newProgramIds,
          programId: newProgramIds.length > 0 ? newProgramIds[0] : undefined, // Keep first as main for backward compatibility
          programColor: program?.color 
        };
      }
      return player;
    });
    
    // Update in coachesList - now supporting multiple programs
    const updatedCoachesList = coachesList.map(coach => {
      if (coach.id === personId) {
        // Initialize programIds array if it doesn't exist
        const currentProgramIds = coach.programIds || [];
        
        // Add the program if not already assigned, otherwise remove it
        const newProgramIds = currentProgramIds.includes(programId)
          ? currentProgramIds.filter(id => id !== programId)
          : [...currentProgramIds, programId];
          
        const program = programs.find(p => p.id === programId);
        return { 
          ...coach, 
          programIds: newProgramIds,
          programId: newProgramIds.length > 0 ? newProgramIds[0] : undefined, // Keep first as main for backward compatibility
          programColor: program?.color 
        };
      }
      return coach;
    });
    
    // Also update if person is assigned to a court
    const updatedCourts = courts.map(court => ({
      ...court,
      occupants: court.occupants.map(occupant => {
        if (occupant.id === personId) {
          // Initialize programIds array if it doesn't exist
          const currentProgramIds = occupant.programIds || [];
          
          // Add the program if not already assigned, otherwise remove it
          const newProgramIds = currentProgramIds.includes(programId)
            ? currentProgramIds.filter(id => id !== programId)
            : [...currentProgramIds, programId];
            
          const program = programs.find(p => p.id === programId);
          return { 
            ...occupant, 
            programIds: newProgramIds,
            programId: newProgramIds.length > 0 ? newProgramIds[0] : undefined, // Keep first as main for backward compatibility
            programColor: program?.color 
          };
        }
        return occupant;
      })
    }));
    
    setPlayersList(updatedPlayersList);
    setCoachesList(updatedCoachesList);
    
    const program = programs.find(p => p.id === programId);
    const person = [...playersList, ...coachesList].find(p => p.id === personId);
    
    toast({
      title: "Programma Assegnato",
      description: `${program?.name} è stato assegnato a ${person?.name}`,
    });
    
    return updatedCourts;
  };

  return {
    handleAssignProgram
  };
};
