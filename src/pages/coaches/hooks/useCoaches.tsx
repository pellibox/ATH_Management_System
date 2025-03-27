
import { PersonData, Program } from "@/components/court-vision/types";
import { useCoachesState } from "./useCoachesState";

export function useCoaches(
  coachesList: PersonData[],
  playersList: PersonData[],
  programs: Program[]
) {
  // Use the main coaches state hook that already combines all the other hooks
  const coachesState = useCoachesState(coachesList, playersList);
  
  // Return all the properties and methods from the composed hooks
  return {
    ...coachesState,
    // Add programs-specific filtering from useCoachPrograms
    programs: programs
  };
}
