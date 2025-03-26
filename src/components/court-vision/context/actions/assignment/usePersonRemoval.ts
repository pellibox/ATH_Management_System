
import { PersonData } from "../../../types";
import { useToast } from "@/hooks/use-toast";

export const usePersonRemoval = (
  courts: any[],
  setCourts: React.Dispatch<React.SetStateAction<any[]>>,
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>
) => {
  const { toast } = useToast();

  const handleRemovePerson = (personId: string, timeSlot?: string) => {
    console.log("Removing person:", personId, timeSlot);
    
    const updatedCourts = courts.map(court => {
      return {
        ...court,
        occupants: court.occupants.filter(occupant => {
          if (timeSlot) {
            return !(occupant.id === personId && occupant.timeSlot === timeSlot);
          }
          return occupant.id !== personId;
        })
      };
    });
    
    setCourts(updatedCourts);
    
    // Also remove from people list if they're there temporarily
    const personToRemove = people.find(p => p.id === personId);
    if (personToRemove) {
      setPeople(people.filter(p => p.id !== personId));
      
      toast({
        title: "Persona Rimossa",
        description: `${personToRemove.name} è stata rimossa dal campo`,
      });
    }
  };

  return { handleRemovePerson };
};
