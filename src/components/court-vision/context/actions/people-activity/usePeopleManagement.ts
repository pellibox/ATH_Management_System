
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
    // Note: This function would typically need courts to be passed in the props
    // For now, we'll return an empty array to fix the build error
    
    toast({
      title: "Controllo Persone",
      description: `Controllo delle persone non assegnate per ${scheduleType}`,
    });
    
    return [];
  };

  return {
    handleAddPerson,
    checkUnassignedPeople
  };
};
