
import { Program, PersonData } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useProgramHandlers(
  programs: Program[],
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>,
  playersList: PersonData[],
  coachesList: PersonData[]
) {
  const { toast } = useToast();

  const handleAddProgram = (program: Program) => {
    setPrograms([...programs, program]);
  };

  const handleRemoveProgram = (programId: string) => {
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

  return {
    handleAddProgram,
    handleRemoveProgram
  };
}
