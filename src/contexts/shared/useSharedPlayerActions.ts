import { useState, useRef } from "react";
import { PersonData } from "@/components/court-vision/types";
import { Player } from "@/types/player";
import { convertPlayerToPerson } from "./utils/playerConversion";
import { mockPlayers } from "@/types/player";

export function useSharedPlayerActions() {
  // Initialize with empty array, will be populated on mount
  const [sharedPlayers, setSharedPlayers] = useState<PersonData[]>([]);
  
  // Track last update to prevent excessive updates
  const lastUpdateRef = useRef<Record<string, number>>({});
  const isInitializedRef = useRef(false);

  // Add a new player
  const addPlayer = (player: Player) => {
    const newPerson = convertPlayerToPerson(player);
    setSharedPlayers((prevPlayers) => {
      // Check if player already exists to avoid duplicates
      const exists = prevPlayers.some(p => p.id === player.id);
      if (exists) {
        return prevPlayers.map(p => p.id === player.id ? newPerson : p);
      }
      return [...prevPlayers, newPerson];
    });
  };

  // Update an existing player
  const updatePlayer = (player: Player) => {
    // Implement throttling to prevent excessive updates
    const now = Date.now();
    if (now - (lastUpdateRef.current[player.id] || 0) < 1000) {
      // Skip updates that are too frequent for the same player
      return;
    }
    
    // Update timestamp
    lastUpdateRef.current[player.id] = now;
    
    const updatedPerson = convertPlayerToPerson(player);
    setSharedPlayers((prevPlayers) => {
      // Check if player exists
      const exists = prevPlayers.some(p => p.id === player.id);
      if (!exists) {
        return [...prevPlayers, updatedPerson];
      }
      return prevPlayers.map((p) => (p.id === player.id ? updatedPerson : p));
    });
  };

  // Remove a player
  const removePlayer = (id: string) => {
    setSharedPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== id));
  };

  // Get player by ID
  const getPlayerById = (id: string) => {
    return sharedPlayers.find((p) => p.id === id);
  };
  
  // Sync hours between Court Vision and Players page
  const syncHours = (id: string, completedHours: number, missedHours: number) => {
    // Implement throttling to prevent excessive updates
    const now = Date.now();
    const syncKey = `hours-${id}`;
    if (now - (lastUpdateRef.current[syncKey] || 0) < 1000) {
      // Skip updates that are too frequent for the same hours sync
      return;
    }
    
    // Update timestamp
    lastUpdateRef.current[syncKey] = now;
    
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
    if (sharedPlayers.length === 0 && isInitializedRef.current) {
      // If we have no players but we're initialized, reload from mock data
      setSharedPlayers(mockPlayers.map(convertPlayerToPerson));
      console.log("SharedPlayerContext: Reloaded players from mock data");
      return;
    }
    
    // Otherwise just trigger a refresh with current data
    setSharedPlayers(prev => [...prev]);
  };

  return {
    sharedPlayers,
    setSharedPlayers,
    isInitializedRef,
    addPlayer,
    updatePlayer,
    removePlayer,
    getPlayerById,
    syncHours,
    updateSharedPlayerList
  };
}
