
import { PersonData, ActivityData } from "../../types";
import { useToast } from "@/hooks/use-toast";

export const usePeopleActivityActions = (
  people: PersonData[],
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>,
  activities: ActivityData[],
  setActivities: React.Dispatch<React.SetStateAction<ActivityData[]>>,
  playersList: PersonData[],
  setPlayersList: React.Dispatch<React.SetStateAction<PersonData[]>>,
  coachesList: PersonData[],
  setCoachesList: React.Dispatch<React.SetStateAction<PersonData[]>>,
  programs: any[],
  courts: any[]
) => {
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

  const handleAddActivity = (activityData: {name: string, type: string, duration: string}) => {
    const newActivity: ActivityData = {
      id: `new-activity-${Date.now()}`,
      name: activityData.name,
      type: activityData.type,
      duration: activityData.duration,
    };
    
    setActivities([...activities, newActivity]);
    toast({
      title: "Attività Aggiunta",
      description: `${newActivity.name} è stata aggiunta alla lista`,
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

  // New method to update coach availability
  const handleSetCoachAvailability = (coachId: string, isPresent: boolean, reason?: string) => {
    // Update the coach in the coaches list
    const updatedCoachesList = coachesList.map(coach => {
      if (coach.id === coachId) {
        return {
          ...coach,
          isPresent,
          absenceReason: isPresent ? undefined : reason || "Non disponibile"
        };
      }
      return coach;
    });
    
    // Also update in people list if present
    const updatedPeople = people.map(person => {
      if (person.id === coachId && person.type === "coach") {
        return {
          ...person,
          isPresent,
          absenceReason: isPresent ? undefined : reason || "Non disponibile"
        };
      }
      return person;
    });
    
    // Also remove from any courts if the coach is now unavailable
    const updatedCourts = isPresent 
      ? courts 
      : courts.map(court => ({
          ...court,
          occupants: court.occupants.filter(occupant => 
            !(occupant.id === coachId && occupant.type === "coach")
          )
        }));
    
    setCoachesList(updatedCoachesList);
    setPeople(updatedPeople);
    
    const coach = coachesList.find(c => c.id === coachId);
    
    toast({
      title: isPresent ? "Coach Disponibile" : "Coach Non Disponibile",
      description: isPresent 
        ? `${coach?.name} è stato segnato come disponibile` 
        : `${coach?.name} è stato segnato come non disponibile${reason ? `: ${reason}` : ""}`,
    });
    
    return updatedCourts;
  };

  return {
    handleAddPerson,
    handleAddActivity,
    checkUnassignedPeople,
    handleAssignProgram,
    handleSetCoachAvailability
  };
};
