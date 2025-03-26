
import { PersonData } from "../../../types";
import { useToast } from "@/hooks/use-toast";
import { CoachAvailabilityProps } from "./types";

export const useCoachAvailability = ({
  coachesList,
  setCoachesList,
  people,
  setPeople,
  courts
}: CoachAvailabilityProps) => {
  const { toast } = useToast();

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
    handleSetCoachAvailability
  };
};
