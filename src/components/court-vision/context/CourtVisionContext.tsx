
import React, { createContext, useContext, useState, useEffect } from "react";
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
  console.log("useCourtVision called, context exists:", !!context);
  if (!context) {
    console.error("useCourtVision called outside of provider");
    throw new Error("useCourtVision must be used within a CourtVisionProvider");
  }
  return context;
};

export interface ExtendedCourtVisionProviderProps extends CourtVisionProviderProps {
  initialPlayers?: PersonData[];
}

export const CourtVisionProvider: React.FC<ExtendedCourtVisionProviderProps> = ({ 
  children, 
  initialPlayers = [] 
}) => {
  console.log("CourtVisionProvider rendering with children:", !!children);
  
  // Get state from hook
  const initialState = useCourtVisionState();
  
  console.log("CourtVisionProvider initializing with state:", { 
    courtsCount: initialState.courts.length 
  });

  // Set up state setters
  const [courts, setCourts] = useState(initialState.courts);
  const [people, setPeople] = useState(initialState.people);
  const [activities, setActivities] = useState(initialState.activities);
  const [playersList, setPlayersList] = useState(initialPlayers.length > 0 ? initialPlayers : initialState.playersList);
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

  // Update playersList when initialPlayers changes
  useEffect(() => {
    if (initialPlayers && initialPlayers.length > 0) {
      console.log("Setting playersList from initialPlayers:", initialPlayers.length);
      setPlayersList(initialPlayers);
    }
  }, [initialPlayers]);

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
    isLayoutView: false,

    setSelectedDate,
    handleSetCoachAvailability,
    ...programHandlers,
    ...actions
  };

  console.log("CourtVisionProvider rendering with context:", { 
    filteredCourtsCount: contextValue.filteredCourts.length
  });

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
}
