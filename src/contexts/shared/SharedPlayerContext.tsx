
import React, { createContext, useContext, useEffect, useMemo } from "react";
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

  // Initialize with mock data on first load ONLY if sharedPlayers is empty
  useEffect(() => {
    if (!isInitializedRef.current && sharedPlayers.length === 0) {
      // Remove duplicates from mock data before initializing
      const uniquePlayers = Array.from(
        new Map(mockPlayers.map(player => [player.id, player])).values()
      );
      const initialPlayers = uniquePlayers.map(convertPlayerToPerson);
      setSharedPlayers(initialPlayers);
      isInitializedRef.current = true;
      console.log("SharedPlayerContext initialized with", initialPlayers.length, "unique players");
    }
  }, [setSharedPlayers, sharedPlayers.length]);

  // Create memoized context value to prevent unnecessary renders
  const contextValue = useMemo(() => ({
    sharedPlayers,
    addPlayer,
    updatePlayer,
    removePlayer,
    getPlayerById,
    syncHours,
    updateSharedPlayerList
  }), [sharedPlayers, addPlayer, updatePlayer, removePlayer, getPlayerById, syncHours, updateSharedPlayerList]);

  return (
    <SharedPlayerContext.Provider value={contextValue}>
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
