
import { usePeopleManagement } from './usePeopleManagement';
import { useActivityManagement } from './useActivityManagement';
import { useProgramAssignment } from './useProgramAssignment';
import { useCoachAvailability } from './useCoachAvailability';

export const usePeopleActivityActions = (
  people,
  setPeople,
  activities,
  setActivities,
  playersList,
  setPlayersList,
  coachesList,
  setCoachesList,
  programs,
  courts
) => {
  // People management actions
  const peopleManagement = usePeopleManagement({
    people, 
    setPeople, 
    playersList, 
    setPlayersList, 
    coachesList, 
    setCoachesList
  });
  
  // Activity management actions
  const activityManagement = useActivityManagement({
    activities,
    setActivities
  });
  
  // Program assignment actions
  const programAssignment = useProgramAssignment({
    playersList,
    setPlayersList,
    coachesList,
    setCoachesList,
    programs,
    courts
  });
  
  // Coach availability actions
  const coachAvailability = useCoachAvailability({
    coachesList,
    setCoachesList,
    people,
    setPeople,
    courts
  });
  
  return {
    ...peopleManagement,
    ...activityManagement,
    ...programAssignment,
    ...coachAvailability
  };
};

export * from './types';
