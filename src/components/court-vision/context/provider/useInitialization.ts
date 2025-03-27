
import { useEffect, useState, useRef } from "react";
import { PersonData } from "../../types";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";

export function useInitialization(
  initialPlayers: PersonData[] = [],
  programs: any[],
  setPlayersList: React.Dispatch<React.SetStateAction<PersonData[]>>,
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>
) {
  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Keep track of last sync time to avoid too frequent notifications
  const lastSyncRef = useRef<number>(0);
  const lastPlayerCountRef = useRef<number>(0);
  
  // Get the shared players context to sync changes back
  const { syncHours, updateSharedPlayerList, sharedPlayers } = useSharedPlayers();

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

  // First check if we have initialPlayers, otherwise try sharedPlayers
  useEffect(() => {
    const players = initialPlayers.length > 0 ? initialPlayers : sharedPlayers;
    
    if (players && players.length > 0) {
      const now = Date.now();
      const playerCount = players.length;
      
      console.log("useInitialization: Processing players", {
        count: playerCount,
        source: initialPlayers.length > 0 ? 'initialPlayers' : 'sharedPlayers'
      });
      
      // Prevent duplicate processing of the same data
      if (playerCount === lastPlayerCountRef.current && now - lastSyncRef.current < 3000) {
        return;
      }
      
      // Update the refs
      lastSyncRef.current = now;
      lastPlayerCountRef.current = playerCount;
      
      // Map player data to include necessary properties for court vision
      const mappedPlayers = players.map(player => {
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
      
      console.log("useInitialization: Setting player list with", activePlayers.length, "active players");
      setPlayersList(activePlayers);
      setIsInitialized(true);
      
      // Also update people list to include these players
      setPeople(prevPeople => {
        // Filter out existing players
        const nonPlayerPeople = prevPeople.filter(p => p.type !== "player");
        // Add mapped active players
        return [...nonPlayerPeople, ...activePlayers];
      });
    } else if (!isInitialized) {
      // If no players available, request update from shared context
      console.log("useInitialization: No players available, requesting update from shared context");
      updateSharedPlayerList();
    }
  }, [initialPlayers, sharedPlayers, programs, setPlayersList, setPeople, isInitialized, updateSharedPlayerList]);

  return {
    isInitialized,
    syncHours
  };
}
