
import React, { createContext, useContext, useState } from "react";
import { CourtVisionContextType } from "./CourtVisionTypes";
import { useCourtVisionState } from "./useCourtVisionState";
import { useCourtVisionActions } from "./CourtVisionActions";
import { useCourtVisionFilters } from "./CourtVisionFilters";
import { useProgramHandlers } from "./useProgramHandlers";
import { ExtraHoursConfirmationDialog } from "../ExtraHoursConfirmationDialog";
import { CourtVisionProviderProps } from "./types";

export const CourtVisionContext = createContext<CourtVisionContextType | undefined>(undefined);

export const useCourtVision = () => {
  const context = useContext(CourtVisionContext);
  if (!context) {
    throw new Error("useCourtVision must be used within a CourtVisionProvider");
  }
  return context;
};

export const CourtVisionProvider: React.FC<CourtVisionProviderProps> = ({ children }) => {
  // Get state from hook
  const state = useCourtVisionState();
  
  // Set up state setters
  const [courts, setCourts] = useState(state.courts);
  const [people, setPeople] = useState(state.people);
  const [activities, setActivities] = useState(state.activities);
  const [playersList, setPlayersList] = useState(state.playersList);
  const [coachesList, setCoachesList] = useState(state.coachesList);
  const [programs, setPrograms] = useState(state.programs);
  const [templates, setTemplates] = useState(state.templates);
  const [dateSchedules, setDateSchedules] = useState(state.dateSchedules);
  const [selectedDate, setSelectedDate] = useState(state.selectedDate);
  const [showExtraHoursDialog, setShowExtraHoursDialog] = useState(state.showExtraHoursDialog);
  const [pendingAssignment, setPendingAssignment] = useState(state.pendingAssignment);

  // Apply filters
  useCourtVisionFilters({
    courts,
    currentSport: state.currentSport,
    playersList,
    coachesList,
    setFilteredCourts: (courts) => state.filteredCourts = courts,
    setFilteredPlayers: (players) => state.filteredPlayers = players,
    setFilteredCoaches: (coaches) => state.filteredCoaches = coaches
  });

  // Get program handlers
  const programHandlers = useProgramHandlers(
    programs,
    setPrograms,
    playersList,
    coachesList
  );

  // Get actions
  const actions = useCourtVisionActions({
    courts,
    setCourts,
    people,
    setPeople,
    activities,
    setActivities,
    playersList,
    setPlayersList,
    coachesList,
    setCoachesList,
    programs,
    setPrograms,
    templates,
    setTemplates,
    dateSchedules,
    setDateSchedules,
    selectedDate,
    setSelectedDate,
    timeSlots: state.timeSlots
  });

  // Handle coach availability
  const handleSetCoachAvailability = (coachId: string, isPresent: boolean, reason?: string) => {
    const updatedCourts = actions.handleSetCoachAvailability(coachId, isPresent, reason);
    setCourts(updatedCourts);
  };

  // Create context value
  const contextValue: CourtVisionContextType = {
    selectedDate,
    templates,
    dateSchedules,
    timeSlots: state.timeSlots,
    courts,
    filteredCourts: state.filteredCourts,
    people,
    activities,
    playersList,
    coachesList,
    programs,
    filteredPlayers: state.filteredPlayers,
    filteredCoaches: state.filteredCoaches,
    currentSport: state.currentSport,
    isLayoutView: state.isLayoutView,

    setSelectedDate,
    handleSetCoachAvailability,
    ...programHandlers,
    ...actions
  };

  return (
    <CourtVisionContext.Provider value={contextValue}>
      {children}
      {actions.showExtraHoursDialog && (
        <ExtraHoursConfirmationDialog
          isOpen={actions.showExtraHoursDialog}
          onOpenChange={actions.setShowExtraHoursDialog}
          pendingAssignment={actions.pendingAssignment}
          currentHours={actions.getCurrentHours()}
          newHours={actions.getNewHours()}
          onConfirm={actions.handleConfirmExtraHours}
          onCancel={actions.handleCancelExtraHours}
        />
      )}
    </CourtVisionContext.Provider>
  );
};
