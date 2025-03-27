import { useState, useRef, useCallback } from "react";
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

  // Helper to remove duplicates from players array
  const removeDuplicates = useCallback((players: PersonData[]): PersonData[] => {
    const uniquePlayers = new Map<string, PersonData>();
    
    // Use Map to automatically keep only the latest version of each player
    players.forEach(player => {
      uniquePlayers.set(player.id, player);
    });
    
    return Array.from(uniquePlayers.values());
  }, []);

  // Add a new player
  const addPlayer = useCallback((player: Player) => {
    const newPerson = convertPlayerToPerson(player);
    setSharedPlayers((prevPlayers) => {
      // Check if player already exists to avoid duplicates
      const exists = prevPlayers.some(p => p.id === player.id);
      if (exists) {
        console.log(`SharedPlayerContext: Updating existing player ${player.name} (${player.id})`);
        const updated = prevPlayers.map(p => p.id === player.id ? newPerson : p);
        return removeDuplicates(updated);
      }
      console.log(`SharedPlayerContext: Adding new player ${player.name} (${player.id})`);
      return removeDuplicates([...prevPlayers, newPerson]);
    });
  }, [removeDuplicates]);

  // Update an existing player - IMPORTANT: Court Vision should only update hours
  const updatePlayer = useCallback((player: Player) => {
    // Implement throttling to prevent excessive updates
    const now = Date.now();
    if (now - (lastUpdateRef.current[player.id] || 0) < 500) {
      // Skip updates that are too frequent for the same player
      return;
    }
    
    // Update timestamp
    lastUpdateRef.current[player.id] = now;
    
    // Convert the Player to PersonData while preserving existing data in sharedPlayers
    setSharedPlayers((prevPlayers) => {
      // Find existing player to preserve any Court Vision specific data
      const existingPlayer = prevPlayers.find(p => p.id === player.id);
      
      // Convert the player to PersonData
      const updatedPerson = convertPlayerToPerson(player);
      
      // Preserve existing Court Vision data if it exists
      if (existingPlayer) {
        // Keep Court Vision specifics like position, courtId, etc.
        const preservedPerson = {
          ...updatedPerson,
          // Preserve court assignment data
          position: existingPlayer.position,
          courtId: existingPlayer.courtId,
          timeSlot: existingPlayer.timeSlot,
          endTimeSlot: existingPlayer.endTimeSlot,
        };
        
        const updated = prevPlayers.map((p) => 
          (p.id === player.id ? preservedPerson : p)
        );
        
        return removeDuplicates(updated);
      }
      
      // If player doesn't exist, just add the new one
      return removeDuplicates([...prevPlayers, updatedPerson]);
    });
  }, [removeDuplicates]);

  // Remove a player
  const removePlayer = useCallback((id: string) => {
    setSharedPlayers((prevPlayers) => {
      const playerToRemove = prevPlayers.find(p => p.id === id);
      console.log(`SharedPlayerContext: Removing player ${playerToRemove?.name || id}`);
      return prevPlayers.filter((p) => p.id !== id);
    });
  }, []);

  // Get player by ID
  const getPlayerById = useCallback((id: string) => {
    return sharedPlayers.find((p) => p.id === id);
  }, [sharedPlayers]);
  
  // Sync hours between Court Vision and Players page
  // NOTE: This only syncs hours, not other player data
  const syncHours = useCallback((id: string, completedHours: number, missedHours: number) => {
    // Implement throttling to prevent excessive updates
    const now = Date.now();
    const syncKey = `hours-${id}`;
    if (now - (lastUpdateRef.current[syncKey] || 0) < 500) {
      // Skip updates that are too frequent for the same hours sync
      return;
    }
    
    // Update timestamp
    lastUpdateRef.current[syncKey] = now;
    
    setSharedPlayers((prevPlayers) => 
      prevPlayers.map((p) => {
        if (p.id === id) {
          const player = prevPlayers.find(player => player.id === id);
          console.log(`SharedPlayerContext: Syncing hours for player ${player?.name || id}`, {
            completedHours,
            missedHours,
            hoursAssigned: completedHours
          });
          
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
  }, []);

  // Force a refresh of the shared player list (useful when switching between pages)
  const updateSharedPlayerList = useCallback(() => {
    if (sharedPlayers.length === 0 && isInitializedRef.current) {
      // If we have no players but we're initialized, reload from mock data
      // First remove duplicates from mock data
      const uniquePlayers = Array.from(
        new Map(mockPlayers.map(player => [player.id, player])).values()
      );
      const refreshedPlayers = uniquePlayers.map(convertPlayerToPerson);
      setSharedPlayers(refreshedPlayers);
      console.log("SharedPlayerContext: Reloaded players from mock data");
      return;
    }
    
    // Otherwise just trigger a refresh with current data
    // and ensure no duplicates
    console.log("SharedPlayerContext: Refreshing player list with", sharedPlayers.length, "players");
    setSharedPlayers(prev => removeDuplicates([...prev]));
  }, [sharedPlayers, removeDuplicates]);

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
