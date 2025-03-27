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
  const { syncHours, sharedPlayers, updateSharedPlayerList } = useSharedPlayers();

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
      "Future Champions": 4,
      "Performance": 6,
      "Elite": 8
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
      "Future Champions": 1.5,
      "Performance": 1.5,
      "Elite": 2
    };
    
    return programDurations[player.programId] || 1;
  };

  // Deduplicate players by ID
  const removeDuplicates = (players: PersonData[]): PersonData[] => {
    const uniquePlayers = new Map<string, PersonData>();
    players.forEach(player => {
      uniquePlayers.set(player.id, player);
    });
    return Array.from(uniquePlayers.values());
  };

  // First load from sharedPlayers, as that's the source of truth
  useEffect(() => {
    // Ensure we use sharedPlayers (from Player section) as the source of truth
    if (sharedPlayers && sharedPlayers.length > 0) {
      const now = Date.now();
      const playerCount = sharedPlayers.length;
      
      // Prevent duplicate processing of the same data
      if (playerCount === lastPlayerCountRef.current && now - lastSyncRef.current < 3000) {
        return;
      }
      
      console.log("useInitialization: Processing players", {
        count: playerCount,
        source: 'sharedPlayers'
      });
      
      // Update the refs
      lastSyncRef.current = now;
      lastPlayerCountRef.current = playerCount;
      
      // Remove any potential duplicates in the sharedPlayers
      const uniquePlayers = removeDuplicates(sharedPlayers);
      
      // Map player data to include necessary properties for court vision
      const mappedPlayers = uniquePlayers.map(player => {
        // Calculate programColor based on program if not already set
        let programColor = player.programColor;
        if (!programColor && player.programId) {
          const program = programs.find(p => p.id === player.programId);
          if (program) {
            programColor = program.color;
          }
        }
        
        // Create new object with court vision properties, preserving original data
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
      
      // Only include players with status !== "pending" in the playersList
      const activePlayers = mappedPlayers.filter(player => player.status !== "pending");
      
      console.log("useInitialization: Setting player list with", activePlayers.length, "active players");
      
      // Set playersList with unique active players
      setPlayersList(activePlayers);
      setIsInitialized(true);
      
      // Also update people list to include these players
      setPeople(prevPeople => {
        // Filter out existing players from people list
        const nonPlayerPeople = prevPeople.filter(p => p.type !== "player");
        // Add mapped active players
        return [...nonPlayerPeople, ...activePlayers];
      });
    }
  }, [sharedPlayers, programs, setPlayersList, setPeople]);

  // When component mounts, make sure to update the shared player list once
  // to clean up any potential duplicates
  useEffect(() => {
    // Call once after initialization to clean up any duplicates
    if (!isInitialized && sharedPlayers.length > 0) {
      updateSharedPlayerList();
    }
  }, [isInitialized, sharedPlayers.length, updateSharedPlayerList]);

  return {
    isInitialized,
    syncHours
  };
}
