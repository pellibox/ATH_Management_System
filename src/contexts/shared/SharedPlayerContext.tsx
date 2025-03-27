
import React, { createContext, useContext, useEffect } from "react";
import { PersonData } from "@/components/court-vision/types";
import { Player } from "@/types/player";
import { useSharedPlayerActions } from "./useSharedPlayerActions";
import { convertPlayerToPerson } from "./utils/playerConversion";
import { SharedPlayerContextType } from "./types";
import { mockPlayers } from "@/types/player";

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
  // Get shared state and actions
  const {
    sharedPlayers,
    setSharedPlayers,
    isInitializedRef,
    addPlayer,
    updatePlayer,
    removePlayer,
    getPlayerById,
    syncHours,
    updateSharedPlayerList
  } = useSharedPlayerActions();

  // Initialize with mock data on first load
  useEffect(() => {
    if (!isInitializedRef.current) {
      const initialPlayers = mockPlayers.map(convertPlayerToPerson);
      setSharedPlayers(initialPlayers);
      isInitializedRef.current = true;
      console.log("SharedPlayerContext initialized with", initialPlayers.length, "players");
    }
  }, [setSharedPlayers]);

  // Log current state for debugging
  useEffect(() => {
    console.log("SharedPlayerContext: Current state has", sharedPlayers.length, "players");
  }, [sharedPlayers.length]);

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
