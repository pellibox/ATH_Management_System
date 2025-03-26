
import { PersonData } from "../../../../types";
import { PERSON_TYPES } from "../../../../constants";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to handle the logic for removing a person from a court
 */
export const usePersonRemoval = (
  courts: any[],
  setCourts: React.Dispatch<React.SetStateAction<any[]>>,
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>
) => {
  const { toast } = useToast();

  const handleRemovePerson = (personId: string, timeSlot?: string) => {
    console.log("handleRemovePerson:", { personId, timeSlot });
    
    // First, find the person in the courts
    let personToReset: PersonData | null = null;
    let isPlayer = false;
    
    // Identify the person and their type
    courts.forEach(court => {
      court.occupants.forEach((occupant: PersonData) => {
        if (occupant.id === personId && (!timeSlot || occupant.timeSlot === timeSlot)) {
          personToReset = { ...occupant };
          isPlayer = occupant.type === PERSON_TYPES.PLAYER;
        }
      });
    });
    
    let updatedCourts;
    
    if (timeSlot) {
      // Remove person only from specific time slot
      updatedCourts = courts.map(court => ({
        ...court,
        occupants: court.occupants.filter(person => 
          !(person.id === personId && person.timeSlot === timeSlot)
        )
      }));
    } else {
      // Remove person from all time slots
      updatedCourts = courts.map(court => ({
        ...court,
        occupants: court.occupants.filter(person => person.id !== personId)
      }));
    }
    
    setCourts(updatedCourts);
    
    // If it's a player, add them back to the available list
    if (personToReset && isPlayer) {
      // Reset assignment-specific properties
      const resetPerson: PersonData = {
        ...personToReset,
        courtId: undefined,
        timeSlot: undefined,
        sourceTimeSlot: undefined,
        endTimeSlot: undefined,
        position: undefined,
        // Maintain other properties like name, programId, etc.
      };
      
      // Check if already in available people list
      const alreadyInList = people.some(p => p.id === personId);
      
      if (!alreadyInList) {
        // Only add to available list if not already there
        setPeople(prev => [...prev, resetPerson]);
        console.log("Player added back to available list:", resetPerson.name);
      }
    }
    
    toast({
      title: "Persona Rimossa",
      description: "La persona è stata rimossa dal campo",
    });
  };

  return { handleRemovePerson };
};
