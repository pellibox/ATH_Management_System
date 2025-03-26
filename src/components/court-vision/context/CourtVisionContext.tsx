
import React, { createContext, useContext, useState, useEffect } from "react";
import { CourtVisionContextType } from "./CourtVisionTypes";
import { useCourtVisionState } from "./useCourtVisionState";
import { useCourtVisionActions } from "./CourtVisionActions";
import { useCourtVisionFilters } from "./CourtVisionFilters";
import { useProgramHandlers } from "./useProgramHandlers";
import { ExtraHoursConfirmationDialog } from "../ExtraHoursConfirmationDialog";
import { CoachOverlapDialog } from "../CoachOverlapDialog";
import { CourtVisionProviderProps } from "./types";
import { PersonData } from "../types";
import { useCourtManagement } from "./hooks/useCourtManagement";
import { useTemplateManagement } from "./hooks/useTemplateManagement";
import { useUnassignedCheck } from "./hooks/useUnassignedCheck";
import { usePersonManagement } from "./hooks/usePersonManagement";
import { useDialogStates } from "./hooks/useDialogStates";

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
  const [activities, setActivities] = useState(initialState.activities);
  const [people, setPeople] = useState(initialState.people);
  const [selectedDate, setSelectedDate] = useState(initialState.selectedDate);
  const [dateSchedules, setDateSchedules] = useState(initialState.dateSchedules);
  
  // Use the extracted hooks
  const { 
    courts, 
    setCourts, 
    handleAddCourt, 
    handleUpdateCourt, 
    handleRemoveCourt 
  } = useCourtManagement(initialState.courts);
  
  const {
    templates,
    setTemplates,
    saveAsTemplate,
    handleSaveTemplate,
    applyTemplate,
    handleLoadTemplate,
    handleDeleteTemplate,
    handleClearSchedule,
    handleDuplicateSchedule
  } = useTemplateManagement(courts);
  
  const {
    playersList,
    setPlayersList,
    coachesList,
    setCoachesList,
    handleAddPlayer,
    handleUpdatePlayer,
    handleRemovePlayer,
    handleAddCoach,
    handleUpdateCoach,
    handleRemoveCoach,
    handleAddPerson,
    handleAddToDragArea
  } = usePersonManagement(
    initialPlayers.length > 0 ? initialPlayers : initialState.playersList,
    initialState.coachesList
  );
  
  const {
    showExtraHoursDialog,
    setShowExtraHoursDialog,
    pendingAssignment,
    setPendingAssignment,
    showCoachOverlapDialog,
    setShowCoachOverlapDialog,
    pendingCoachAssignment,
    setPendingCoachAssignment,
    handleConfirmCoachOverlap,
    handleCancelCoachOverlap,
    handleConfirmExtraHours,
    handleCancelExtraHours,
    getCurrentHours,
    getNewHours
  } = useDialogStates();
  
  const { checkUnassignedPeople } = useUnassignedCheck(courts, playersList, coachesList);

  // Update playersList when initialPlayers changes
  useEffect(() => {
    if (initialPlayers && initialPlayers.length > 0) {
      console.log("Setting playersList from initialPlayers:", initialPlayers.length);
      setPlayersList(initialPlayers);
    }
  }, [initialPlayers]);

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
    initialState.programs,
    (programs) => {}, // This would be a setPrograms function
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
    programs: initialState.programs,
    setPrograms: () => {}, // This would be a setPrograms function
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

  // Create context value with all the required properties
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
    programs: initialState.programs,
    filteredPlayers,
    filteredCoaches,
    currentSport: initialState.currentSport,
    isLayoutView: false,

    setSelectedDate,
    handleSetCoachAvailability,
    
    // Make sure all required functions exist
    handleCreateProgram: programHandlers.handleCreateProgram,
    handleUpdateProgram: programHandlers.handleUpdateProgram,
    handleDeleteProgram: programHandlers.handleDeleteProgram,
    
    // Court management
    handleAddCourt,
    handleUpdateCourt,
    handleRemoveCourt,
    
    // Schedule operations
    handleSaveTemplate,
    saveAsTemplate,
    handleLoadTemplate,
    applyTemplate,
    handleDeleteTemplate,
    handleClearSchedule,
    handleDuplicateSchedule,
    copyToNextDay: actions.copyToNextDay || (() => {}),
    copyToWeek: actions.copyToWeek || (() => {}),
    checkUnassignedPeople,
    
    // Coach overlap dialog state management
    showCoachOverlapDialog: actions.showCoachOverlapDialog || showCoachOverlapDialog,
    setShowCoachOverlapDialog: actions.setShowCoachOverlapDialog || setShowCoachOverlapDialog,
    pendingCoachAssignment: actions.pendingCoachAssignment || pendingCoachAssignment,
    handleConfirmCoachOverlap: actions.handleConfirmCoachOverlap || handleConfirmCoachOverlap,
    handleCancelCoachOverlap: actions.handleCancelCoachOverlap || handleCancelCoachOverlap,
    
    // Court actions
    handleRenameCourt: actions.handleRenameCourt || (() => {}),
    handleChangeCourtType: actions.handleChangeCourtType || (() => {}),
    handleChangeCourtNumber: actions.handleChangeCourtNumber || (() => {}),
    
    // People actions
    handleAddPerson: actions.handleAddPerson || handleAddPerson,
    handleAddPlayer,
    handleUpdatePlayer,
    handleRemovePlayer,
    handleAddCoach,
    handleUpdateCoach,
    handleRemoveCoach,
    handleAddToDragArea: (personId: string) => handleAddToDragArea(personId),
    
    // Activity actions
    handleAddActivity: actions.handleAddActivity || (() => {}),
    handleUpdateActivity: actions.handleUpdateActivity || (() => {}),
    handleRemoveActivity: actions.handleRemoveActivity || (() => {}),
    handleRemovePerson: actions.handleRemovePerson || (() => {}),
    handleDrop: actions.handleDrop || (() => {}),
    handleActivityDrop: actions.handleActivityDrop || (() => {}),
    handleAssignPlayerToActivity: actions.handleAssignPlayerToActivity || (() => {}),
    handleAssignProgram: actions.handleAssignProgram || (() => {}),
    
    // Extra hours dialog
    showExtraHoursDialog: actions.showExtraHoursDialog || showExtraHoursDialog,
    setShowExtraHoursDialog: actions.setShowExtraHoursDialog || setShowExtraHoursDialog,
    pendingAssignment: actions.pendingAssignment || pendingAssignment,
    getCurrentHours: actions.getCurrentHours || getCurrentHours,
    getNewHours: actions.getNewHours || getNewHours,
    handleConfirmExtraHours: actions.handleConfirmExtraHours || handleConfirmExtraHours,
    handleCancelExtraHours: actions.handleCancelExtraHours || handleCancelExtraHours,
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
          currentHours={contextValue.getCurrentHours()}
          newHours={contextValue.getNewHours()}
          onConfirm={contextValue.handleConfirmExtraHours}
          onCancel={contextValue.handleCancelExtraHours}
        />
      )}
      {contextValue.showCoachOverlapDialog && contextValue.pendingCoachAssignment && (
        <CoachOverlapDialog
          isOpen={contextValue.showCoachOverlapDialog}
          onOpenChange={contextValue.setShowCoachOverlapDialog}
          coach={contextValue.pendingCoachAssignment.coach}
          existingCourt={contextValue.pendingCoachAssignment.existingCourtName}
          newCourt={courts.find(c => c.id === contextValue.pendingCoachAssignment?.courtId)?.name + " #" + 
            courts.find(c => c.id === contextValue.pendingCoachAssignment?.courtId)?.number || ""}
          timeSlot={contextValue.pendingCoachAssignment.timeSlot || ""}
          onConfirm={contextValue.handleConfirmCoachOverlap}
          onCancel={contextValue.handleCancelCoachOverlap}
        />
      )}
    </CourtVisionContext.Provider>
  );
}
