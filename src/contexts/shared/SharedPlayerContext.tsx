
import React, { createContext, useContext, useState, useEffect } from "react";
import { PersonData } from "@/components/court-vision/types";
import { Player } from "@/types/player";
import { PERSON_TYPES } from "@/components/court-vision/constants";
import { mockPlayers } from "@/types/player";

// Convert Player type to PersonData type
const convertPlayerToPerson = (player: Player): PersonData => {
  console.log("Converting player to PersonData:", player.name, player.status);
  return {
    id: player.id,
    name: player.name,
    type: PERSON_TYPES.PLAYER,
    email: player.email,
    phone: player.phone,
    programId: player.program, // Map program to programId
    programIds: player.programs, // Use programs array if available
    sportTypes: player.sports, // Map sports to sportTypes
    // Add other relevant fields
    notes: player.notes,
    // Hours tracking (these are now part of PersonData)
    completedHours: player.completedHours || 0,
    trainingHours: player.trainingHours || 0,
    extraHours: player.extraHours || 0,
    missedHours: player.missedHours || 0,
    // Program-based metrics
    dailyLimit: calculateDailyLimit(player),
    durationHours: calculateDefaultDuration(player),
    // Status - always convert to confirmed unless explicitly inactive
    status: player.status === 'inactive' ? "pending" : "confirmed"
  };
};

// Convert PersonData back to Player
const convertPersonToPlayer = (person: PersonData): Player => {
  console.log("Converting PersonData back to Player:", person.name);
  return {
    id: person.id,
    name: person.name,
    email: person.email || "",
    phone: person.phone || "",
    level: "",
    program: person.programId,
    programs: person.programIds,
    sports: person.sportTypes,
    notes: person.notes,
    // Convert status back to active/inactive format
    status: person.status === "pending" ? 'inactive' : 'active',
    // Hours tracking
    completedHours: person.completedHours,
    trainingHours: person.trainingHours,
    extraHours: person.extraHours,
    missedHours: person.missedHours
  };
};

// Helper function to calculate daily limit based on program
function calculateDailyLimit(player: Player): number {
  if (!player.program) return 2;
  
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
  
  return programLimits[player.program] || 2;
}

// Helper function to calculate default duration based on program
function calculateDefaultDuration(player: Player): number {
  if (!player.program) return 1;
  
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
  
  return programDurations[player.program] || 1;
}

// Interface for the shared player context
interface SharedPlayerContextType {
  sharedPlayers: PersonData[];
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (id: string) => void;
  getPlayerById: (id: string) => PersonData | undefined;
  syncHours: (id: string, completedHours: number, missedHours: number) => void;
  updateSharedPlayerList: () => void;
}

// Create context with default values
const SharedPlayerContext = createContext<SharedPlayerContextType>({
  sharedPlayers: [],
  addPlayer: () => {},
  updatePlayer: () => {},
  removePlayer: () => {},
  getPlayerById: () => undefined,
  syncHours: () => {},
  updateSharedPlayerList: () => {},
});

// Create provider component
export const SharedPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with mock players converted to PersonData
  const [sharedPlayers, setSharedPlayers] = useState<PersonData[]>(
    mockPlayers.map(convertPlayerToPerson)
  );

  // Log initial state
  useEffect(() => {
    console.log("SharedPlayerContext initialized with", sharedPlayers.length, "players");
    // Log each player to ensure we're starting with the correct data
    sharedPlayers.forEach(player => {
      console.log(`Player in shared context: ${player.name}, status: ${player.status}`);
    });
  }, []);

  // Add a new player
  const addPlayer = (player: Player) => {
    console.log("SharedPlayerContext: Adding player", player.name, player.status);
    const newPerson = convertPlayerToPerson(player);
    setSharedPlayers((prevPlayers) => {
      // Check if player already exists to avoid duplicates
      const exists = prevPlayers.some(p => p.id === player.id);
      if (exists) {
        console.log("Player already exists, updating instead");
        return prevPlayers.map(p => p.id === player.id ? newPerson : p);
      }
      console.log("Adding new player to shared context");
      return [...prevPlayers, newPerson];
    });
  };

  // Update an existing player
  const updatePlayer = (player: Player) => {
    console.log("SharedPlayerContext: Updating player", player.name, player.status);
    const updatedPerson = convertPlayerToPerson(player);
    setSharedPlayers((prevPlayers) => {
      // Check if player exists
      const exists = prevPlayers.some(p => p.id === player.id);
      if (!exists) {
        console.log("Player doesn't exist, adding instead");
        return [...prevPlayers, updatedPerson];
      }
      console.log("Updating existing player in shared context");
      return prevPlayers.map((p) => (p.id === player.id ? updatedPerson : p));
    });
  };

  // Remove a player
  const removePlayer = (id: string) => {
    console.log("SharedPlayerContext: Removing player with ID", id);
    setSharedPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== id));
  };

  // Get player by ID
  const getPlayerById = (id: string) => {
    return sharedPlayers.find((p) => p.id === id);
  };
  
  // Sync hours between Court Vision and Players page
  const syncHours = (id: string, completedHours: number, missedHours: number) => {
    console.log("SharedPlayerContext: Syncing hours for player", id, completedHours, missedHours);
    setSharedPlayers((prevPlayers) => 
      prevPlayers.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            completedHours,
            missedHours,
            // Update hoursAssigned for Court Vision
            hoursAssigned: completedHours
          };
        }
        return p;
      })
    );
  };

  // Force a refresh of the shared player list (useful when switching between pages)
  const updateSharedPlayerList = () => {
    console.log("SharedPlayerContext: Forcing refresh of shared player list - count:", sharedPlayers.length);
    // This effectively re-applies all data transformations and triggers dependents to update
    setSharedPlayers(prev => {
      console.log("Refreshed players count:", prev.length);
      return [...prev];
    });
  };

  return (
    <SharedPlayerContext.Provider
      value={{
        sharedPlayers,
        addPlayer,
        updatePlayer,
        removePlayer,
        getPlayerById,
        syncHours,
        updateSharedPlayerList
      }}
    >
      {children}
    </SharedPlayerContext.Provider>
  );
};

// Custom hook to use the shared player context
export const useSharedPlayers = () => {
  const context = useContext(SharedPlayerContext);
  if (!context) {
    throw new Error("useSharedPlayers must be used within a SharedPlayerProvider");
  }
  return context;
};
