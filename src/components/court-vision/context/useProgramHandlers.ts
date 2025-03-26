
import { Program, PersonData } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useProgramHandlers(
  programs: Program[],
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>,
  playersList: PersonData[],
  coachesList: PersonData[]
) {
  const { toast } = useToast();

  const handleCreateProgram = (program: Program) => {
    setPrograms([...programs, program]);
  };

  const handleAddProgram = handleCreateProgram; // Alias for backward compatibility

  const handleUpdateProgram = (programId: string, updatedProgram: Partial<Program>) => {
    setPrograms(programs.map(program => 
      program.id === programId 
        ? { ...program, ...updatedProgram } 
        : program
    ));
  };

  const handleDeleteProgram = (programId: string) => {
    const isAssigned = [...playersList, ...coachesList].some(person => 
      (person.programId === programId) || 
      (person.programIds && person.programIds.includes(programId))
    );
    
    if (isAssigned) {
      toast({
        title: "Impossibile Rimuovere",
        description: "Questo programma è assegnato ad almeno una persona. Rimuovi l'assegnazione prima di eliminare il programma.",
        variant: "destructive"
      });
      return;
    }
    
    setPrograms(programs.filter(p => p.id !== programId));
    
    toast({
      title: "Programma Rimosso",
      description: "Il programma è stato rimosso con successo.",
    });
  };

  const handleRemoveProgram = handleDeleteProgram; // Alias for backward compatibility

  return {
    handleAddProgram,
    handleRemoveProgram,
    handleCreateProgram,
    handleUpdateProgram,
    handleDeleteProgram
  };
}
