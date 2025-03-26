
import React, { createContext, useContext, useState } from "react";
import { CourtVisionContextType } from "./CourtVisionTypes";
import { useCourtVisionState } from "./useCourtVisionState";
import { useCourtVisionActions } from "./CourtVisionActions";
import { useCourtVisionFilters } from "./CourtVisionFilters";
import { useProgramHandlers } from "./useProgramHandlers";
import { ExtraHoursConfirmationDialog } from "../ExtraHoursConfirmationDialog";
import { CourtVisionProviderProps } from "./types";
import { CourtProps, PersonData } from "../types";

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
  const initialState = useCourtVisionState();
  
  // Set up state setters
  const [courts, setCourts] = useState(initialState.courts);
  const [people, setPeople] = useState(initialState.people);
  const [activities, setActivities] = useState(initialState.activities);
  const [playersList, setPlayersList] = useState(initialState.playersList);
  const [coachesList, setCoachesList] = useState(initialState.coachesList);
  const [programs, setPrograms] = useState(initialState.programs);
  const [templates, setTemplates] = useState(initialState.templates);
  const [dateSchedules, setDateSchedules] = useState(initialState.dateSchedules);
  const [selectedDate, setSelectedDate] = useState(initialState.selectedDate);
  const [showExtraHoursDialog, setShowExtraHoursDialog] = useState(initialState.showExtraHoursDialog);
  const [pendingAssignment, setPendingAssignment] = useState(initialState.pendingAssignment);
  
  // Track filtered state locally
  const [filteredCourts, setFilteredCourts] = useState(initialState.filteredCourts);
  const [filteredPlayers, setFilteredPlayers] = useState(initialState.filteredPlayers);
  const [filteredCoaches, setFilteredCoaches] = useState(initialState.filteredCoaches);

  // Apply filters
  useCourtVisionFilters({
    courts,
    currentSport: initialState.currentSport,
    playersList,
    coachesList,
    setFilteredCourts,
    setFilteredPlayers,
    setFilteredCoaches
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
    timeSlots: initialState.timeSlots
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
    timeSlots: initialState.timeSlots,
    courts,
    filteredCourts,
    people,
    activities,
    playersList,
    coachesList,
    programs,
    filteredPlayers,
    filteredCoaches,
    currentSport: initialState.currentSport,
    isLayoutView: initialState.isLayoutView,

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
