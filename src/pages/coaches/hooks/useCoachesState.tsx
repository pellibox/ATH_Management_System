
import { useState } from "react";
import { PersonData } from "@/components/court-vision/types";
import { useCoachFilters } from "./useCoachFilters";
import { useCoachAvailability } from "./useCoachAvailability";
import { useCoachPrograms } from "./useCoachPrograms";

export function useCoachesState(
  coachesList: PersonData[],
  playersList: PersonData[]
) {
  // Base coach state
  const [coaches, setCoaches] = useState<PersonData[]>(coachesList);
  
  // Get all unique sport types from players and coaches
  const allSportTypes = Array.from(
    new Set([
      ...playersList.flatMap(p => p.sportTypes || []),
      ...coachesList.flatMap(c => c.sportTypes || []),
      "tennis",
      "padel",
      "pickleball",
      "touchtennis"
    ])
  );

  // Import functionality from other hooks
  const {
    searchQuery,
    setSearchQuery,
    sportTypeFilter,
    setSportTypeFilter,
    programFilter,
    setProgramFilter,
    filteredCoaches
  } = useCoachFilters(coaches, allSportTypes);

  const {
    availabilityEvents,
    handleAddAvailabilityEvent,
    handleRemoveAvailabilityEvent,
    handleUpdateAvailabilityEvent,
    selectedDate,
    setSelectedDate,
    currentView,
    setCurrentView
  } = useCoachAvailability();

  const {
    handleAssignProgram,
    handleSendSchedule,
    filteredPrograms
  } = useCoachPrograms();

  return {
    coaches,
    setCoaches,
    searchQuery,
    setSearchQuery,
    sportTypeFilter,
    setSportTypeFilter,
    programFilter,
    setProgramFilter,
    filteredCoaches,
    allSportTypes,
    handleAssignProgram,
    handleSendSchedule,
    availabilityEvents,
    handleAddAvailabilityEvent,
    handleRemoveAvailabilityEvent,
    handleUpdateAvailabilityEvent,
    selectedDate,
    setSelectedDate,
    currentView,
    setCurrentView,
    filteredPrograms
  };
}
