
import { PersonData } from "../../../types";
import { useToast } from "@/hooks/use-toast";
import { PeopleManagementProps } from "./types";

export const usePeopleManagement = ({
  people,
  setPeople,
  playersList,
  setPlayersList,
  coachesList,
  setCoachesList
}: PeopleManagementProps) => {
  const { toast } = useToast();

  const handleAddPerson = (personData: {name: string, type: string, email?: string, phone?: string, sportTypes?: string[]}) => {
    const newPerson: PersonData = {
      id: `new-person-${Date.now()}`,
      name: personData.name,
      type: personData.type as "player" | "coach",
      email: personData.email,
      phone: personData.phone,
      sportTypes: personData.sportTypes,
      programIds: [], // Initialize empty array for multiple programs
      isPresent: true // By default, all coaches are available
    };
    
    setPeople([...people, newPerson]);
    
    // Also add to the appropriate list
    if (personData.type === "player") {
      setPlayersList([...playersList, newPerson]);
    } else if (personData.type === "coach") {
      setCoachesList([...coachesList, newPerson]);
    }
    
    toast({
      title: "Persona Aggiunta",
      description: `${newPerson.name} è stata aggiunta alla lista`,
    });
  };

  const checkUnassignedPeople = (scheduleType: "day" | "week" | "month") => {
    const unassignedPeople = people.filter(person => {
      return !courts.some(court => court.occupants.some(occupant => occupant.id === person.id));
    });
    
    if (unassignedPeople.length > 0) {
      toast({
        title: "Persone Non Assegnate",
        description: `Ci sono ${unassignedPeople.length} persone non assegnate`,
      });
    } else {
      toast({
        title: "Nessuna Persona Non Assegnata",
        description: "Tutte le persone sono state assegnate",
      });
    }
    
    return unassignedPeople;
  };

  return {
    handleAddPerson,
    checkUnassignedPeople
  };
};
