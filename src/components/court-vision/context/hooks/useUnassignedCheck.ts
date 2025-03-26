
import { CourtProps, PersonData } from "../../types";

export function useUnassignedCheck(courts: CourtProps[], players: PersonData[], coaches: PersonData[]) {
  const checkUnassignedPeople = () => {
    const allPeople = [...players, ...coaches];
    const assignedIds = new Set<string>();
    
    // Collect all assigned person IDs
    courts.forEach(court => {
      court.occupants.forEach(person => {
        assignedIds.add(person.id);
      });
    });
    
    // Filter out people who aren't assigned
    const unassigned = allPeople.filter(person => !assignedIds.has(person.id));
    
    return unassigned;
  };

  return { checkUnassignedPeople };
}
