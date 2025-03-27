import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { CourtVisionContextType } from "./CourtVisionTypes";
import { useCourtVisionState } from "./useCourtVisionState";
import { useCourtVisionActions } from "./CourtVisionActions";
import { useCourtVisionFilters } from "./CourtVisionFilters";
import { useProgramHandlers } from "./useProgramHandlers";
import { ExtraHoursConfirmationDialog } from "../ExtraHoursConfirmationDialog";
import { CourtVisionProviderProps } from "./types";
import { CourtProps, PersonData } from "../types";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";
import { toast } from "sonner";

export const CourtVisionContext = createContext<CourtVisionContextType | undefined>(undefined);

export const useCourtVision = () => {
  const context = useContext(CourtVisionContext);
  if (!context) {
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
  // Get state from hook
  const initialState = useCourtVisionState();
  
  // Get the shared players context to sync changes back
  const { syncHours } = useSharedPlayers();
  
  // Set up state setters
  const [courts, setCourts] = useState(initialState.courts);
  const [people, setPeople] = useState(initialState.people);
  const [activities, setActivities] = useState(initialState.activities);
  const [playersList, setPlayersList] = useState<PersonData[]>([]);
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

  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Keep track of last sync time to avoid too frequent notifications
  const lastSyncRef = useRef<number>(0);
  const lastPlayerCountRef = useRef<number>(0);

  // Sync with initialPlayers whenever it changes
  useEffect(() => {
    if (initialPlayers && initialPlayers.length > 0) {
      const now = Date.now();
      const playerCount = initialPlayers.length;
      
      // Prevent duplicate processing of the same data
      if (playerCount === lastPlayerCountRef.current && now - lastSyncRef.current < 3000) {
        return;
      }
      
      // Update the refs
      lastSyncRef.current = now;
      lastPlayerCountRef.current = playerCount;
      
      // Map player data to include necessary properties for court vision
      const mappedPlayers = initialPlayers.map(player => {
        // Calculate programColor based on program if not already set
        let programColor = player.programColor;
        if (!programColor && player.programId) {
          const program = programs.find(p => p.id === player.programId);
          if (program) {
            programColor = program.color;
          }
        }
        
        // Ensure hours tracking properties are preserved
        return {
          ...player,
          programColor,
          // Preserve hours data
          completedHours: player.completedHours || 0,
          trainingHours: player.trainingHours || 0,
          extraHours: player.extraHours || 0,
          missedHours: player.missedHours || 0,
          dailyLimit: player.dailyLimit || calculateDailyLimit(player),
          durationHours: player.durationHours || calculateDefaultDuration(player),
        };
      });
      
      // Only include active players in the playersList (status !== "pending")
      const activePlayers = mappedPlayers.filter(player => player.status !== "pending");
      
      setPlayersList(activePlayers);
      setIsInitialized(true);
      
      // Also update people list to include these players
      setPeople(prevPeople => {
        // Filter out existing players
        const nonPlayerPeople = prevPeople.filter(p => p.type !== "player");
        // Add mapped active players
        return [...nonPlayerPeople, ...activePlayers];
      });
    }
  }, [initialPlayers, programs]);

  // Sync back court assignments to shared context
  useEffect(() => {
    // Only sync when playersList has values and we're initialized
    if (playersList.length > 0 && isInitialized) {
      // When courts or people change, sync hours back to shared context
      playersList.forEach(player => {
        if (player.id) {
          // Sync hours only when necessary, to avoid excessive updates
          syncHours(player.id, player.completedHours || 0, player.missedHours || 0);
        }
      });
    }
  }, [courts, playersList, syncHours, isInitialized]);

  // Helper function to calculate daily limit based on program
  const calculateDailyLimit = (player: PersonData): number => {
    if (!player.programId) return 2;
    
    // Program-specific daily limits
    const programLimits: Record<string, number> = {
      "perf2": 3,
      "perf3": 4.5,
      "perf4": 6,
      "elite": 7.5,
      "elite-full": 10,
      "junior-sit": 3,
      "junior-sat": 1.5,
    };
    
    return programLimits[player.programId] || 2;
  };

  // Helper function to calculate default duration based on program
  const calculateDefaultDuration = (player: PersonData): number => {
    if (!player.programId) return 1;
    
    // Program-specific durations
    const programDurations: Record<string, number> = {
      "perf2": 1.5,
      "perf3": 1.5,
      "perf4": 1.5,
      "elite": 1.5,
      "elite-full": 2,
      "junior-sit": 1,
      "junior-sat": 1,
    };
    
    return programDurations[player.programId] || 1;
  };

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
