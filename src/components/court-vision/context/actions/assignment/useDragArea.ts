
import { PersonData } from "../../../types";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to handle adding people to the drag area
 */
export const useDragArea = (
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>
) => {
  const { toast } = useToast();

  const handleAddToDragArea = (person: PersonData) => {
    if (person.isPresent === false) {
      toast({
        title: "Coach Non Disponibile",
        description: person.absenceReason || "Questo coach non è disponibile",
        variant: "destructive"
      });
      return;
    }
    
    setPeople([...people, person]);
    toast({
      title: "Persona Aggiunta",
      description: `${person.name} è stata aggiunta all'area di trascinamento`,
    });
  };

  return { handleAddToDragArea };
};
