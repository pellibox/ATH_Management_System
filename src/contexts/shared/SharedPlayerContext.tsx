
import React, { createContext, useContext, useState, useEffect } from "react";
import { PersonData } from "@/components/court-vision/types";
import { Player } from "@/types/player";
import { PERSON_TYPES } from "@/components/court-vision/constants";
import { mockPlayers } from "@/types/player";

// Convert Player type to PersonData type
const convertPlayerToPerson = (player: Player): PersonData => {
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
  };
};

// Interface for the shared player context
interface SharedPlayerContextType {
  sharedPlayers: PersonData[];
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (id: string) => void;
  getPlayerById: (id: string) => PersonData | undefined;
}

// Create context with default values
const SharedPlayerContext = createContext<SharedPlayerContextType>({
  sharedPlayers: [],
  addPlayer: () => {},
  updatePlayer: () => {},
  removePlayer: () => {},
  getPlayerById: () => undefined,
});

// Create provider component
export const SharedPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with mock players converted to PersonData
  const [sharedPlayers, setSharedPlayers] = useState<PersonData[]>(
    mockPlayers.map(convertPlayerToPerson)
  );

  // Add a new player
  const addPlayer = (player: Player) => {
    const newPerson = convertPlayerToPerson(player);
    setSharedPlayers((prevPlayers) => [...prevPlayers, newPerson]);
  };

  // Update an existing player
  const updatePlayer = (player: Player) => {
    const updatedPerson = convertPlayerToPerson(player);
    setSharedPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === player.id ? updatedPerson : p))
    );
  };

  // Remove a player
  const removePlayer = (id: string) => {
    setSharedPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== id));
  };

  // Get player by ID
  const getPlayerById = (id: string) => {
    return sharedPlayers.find((p) => p.id === id);
  };

  return (
    <SharedPlayerContext.Provider
      value={{
        sharedPlayers,
        addPlayer,
        updatePlayer,
        removePlayer,
        getPlayerById,
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
