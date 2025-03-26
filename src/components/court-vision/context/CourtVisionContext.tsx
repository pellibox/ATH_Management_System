
import React, { createContext, useContext, useState, useEffect } from "react";
import { CourtVisionContextType } from "./CourtVisionTypes";
import { useCourtVisionState } from "./useCourtVisionState";
import { useCourtVisionActions } from "./CourtVisionActions";
import { useCourtVisionFilters } from "./CourtVisionFilters";
import { useProgramHandlers } from "./useProgramHandlers";
import { ExtraHoursConfirmationDialog } from "../ExtraHoursConfirmationDialog";
import { CoachOverlapDialog } from "../CoachOverlapDialog";
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
  const [showCoachOverlapDialog, setShowCoachOverlapDialog] = useState(false);
  
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

  // Court management functions
  const handleAddCourt = (court: CourtProps) => {
    console.log("Adding court:", court);
    setCourts([...courts, { 
      ...court, 
      occupants: [], 
      activities: [] 
    }]);
  };

  const handleUpdateCourt = (courtId: string, courtData: Partial<CourtProps>) => {
    console.log("Updating court:", courtId, courtData);
    setCourts(courts.map(court => 
      court.id === courtId 
        ? { ...court, ...courtData } 
        : court
    ));
  };

  const handleRemoveCourt = (courtId: string) => {
    console.log("Removing court:", courtId);
    setCourts(courts.filter(court => court.id !== courtId));
  };

  // Create empty implementation functions to satisfy TypeScript requirements
  const handleSaveTemplate = (name: string) => {
    if (actions.saveAsTemplate) {
      actions.saveAsTemplate(name);
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    if (actions.applyTemplate) {
      // Find the template by ID first
      const template = templates.find(t => t.id === templateId);
      if (template) {
        actions.applyTemplate(template);
      }
    }
  };

  const handleClearSchedule = () => {
    console.log("Clear schedule called but not implemented");
  };

  const handleDuplicateSchedule = (sourceDate: Date, targetDate: Date) => {
    console.log("Duplicate schedule called but not implemented", sourceDate, targetDate);
  };

  const checkUnassignedPeople = () => {
    console.log("Check unassigned people called but not implemented");
    return [];
  };

  // Add people management placeholder functions
  const handleAddPlayer = (player: PersonData) => {
    if (actions.handleAddPerson) {
      actions.handleAddPerson(player);
    }
  };

  const handleUpdatePlayer = (playerId: string, player: Partial<PersonData>) => {
    console.log("Update player called but not implemented", playerId, player);
  };

  const handleRemovePlayer = (playerId: string) => {
    if (actions.handleRemovePerson) {
      actions.handleRemovePerson(playerId);
    }
  };

  const handleAddCoach = (coach: PersonData) => {
    if (actions.handleAddPerson) {
      actions.handleAddPerson(coach);
    }
  };

  const handleUpdateCoach = (coachId: string, coach: Partial<PersonData>) => {
    console.log("Update coach called but not implemented", coachId, coach);
  };

  const handleRemoveCoach = (coachId: string) => {
    if (actions.handleRemovePerson) {
      actions.handleRemovePerson(coachId);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log("Delete template called but not implemented", templateId);
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
    programs,
    filteredPlayers,
    filteredCoaches,
    currentSport: initialState.currentSport,
    isLayoutView: false,

    setSelectedDate,
    handleSetCoachAvailability,
    ...programHandlers,
    ...actions,
    
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
    saveAsTemplate: actions.saveAsTemplate || handleSaveTemplate,
    handleLoadTemplate,
    applyTemplate: actions.applyTemplate || (() => []),
    handleDeleteTemplate,
    handleClearSchedule,
    handleDuplicateSchedule,
    copyToNextDay: actions.copyToNextDay || (() => {}),
    copyToWeek: actions.copyToWeek || (() => {}),
    checkUnassignedPeople,
    
    // Coach overlap dialog state management
    showCoachOverlapDialog: actions.showCoachOverlapDialog || showCoachOverlapDialog,
    setShowCoachOverlapDialog: actions.setShowCoachOverlapDialog || setShowCoachOverlapDialog,
    pendingCoachAssignment: actions.pendingCoachAssignment || null,
    handleConfirmCoachOverlap: actions.handleConfirmCoachOverlap || (() => {}),
    handleCancelCoachOverlap: actions.handleCancelCoachOverlap || (() => {}),
    
    // Court actions
    handleRenameCourt: actions.handleRenameCourt || (() => {}),
    handleChangeCourtType: actions.handleChangeCourtType || (() => {}),
    handleChangeCourtNumber: actions.handleChangeCourtNumber || (() => {}),
    
    // People/Activity actions
    handleAddPerson: actions.handleAddPerson || (() => {}),
    handleAddPlayer,
    handleUpdatePlayer,
    handleRemovePlayer,
    handleAddCoach,
    handleUpdateCoach,
    handleRemoveCoach,
    handleAddActivity: actions.handleAddActivity || (() => {}),
    handleUpdateActivity: actions.handleUpdateActivity || (() => {}),
    handleRemoveActivity: actions.handleRemoveActivity || (() => {}),
    
    // Extra hours dialog
    getCurrentHours: actions.getCurrentHours || (() => 0),
    getNewHours: actions.getNewHours || (() => 0),
    handleConfirmExtraHours: actions.handleConfirmExtraHours || (() => {}),
    handleCancelExtraHours: actions.handleCancelExtraHours || (() => {})
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
