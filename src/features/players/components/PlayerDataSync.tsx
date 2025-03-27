
import { useEffect, memo, useRef, useState } from "react";
import { usePlayerContext } from "@/contexts/player/PlayerContext";
import { useSharedPlayers } from "@/contexts/shared/SharedPlayerContext";
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";
import { toast } from "sonner";

// Extract program names from the TENNIS_PROGRAMS constant
const getAvailablePrograms = () => {
  const programNames: string[] = [];
  
  // Flatten all categories into a single array of names
  Object.values(TENNIS_PROGRAMS).forEach(categoryPrograms => {
    if (Array.isArray(categoryPrograms)) {
      categoryPrograms.forEach(program => {
        if (program.name) {
          programNames.push(program.name);
        }
      });
    }
  });
  
  return programNames;
};

// Throttle sync operations
const SYNC_THROTTLE_MS = 1000;

export const PlayerDataSync = memo(() => {
  const { 
    players,
    setAvailablePrograms
  } = usePlayerContext();
  
  // Get shared player context
  const { updatePlayer, sharedPlayers } = useSharedPlayers();
  
  // State to track if we've synced on load
  const [initialSyncDone, setInitialSyncDone] = useState(false);
  
  // Refs to prevent excessive syncs
  const syncTimeoutRef = useRef<number | null>(null);
  const lastSyncTimeRef = useRef<number>(0);
  
  // Log shared players count for debugging
  console.log("Players page: SharedPlayers count:", sharedPlayers.length);
  console.log("Players page: Players count:", players.length);
  
  // Set available programs from TENNIS_PROGRAMS
  useEffect(() => {
    const programs = getAvailablePrograms();
    setAvailablePrograms(programs);
  }, [setAvailablePrograms]);
  
  // One-way sync: Players → Shared Context (only when players array changes)
  useEffect(() => {
    // Skip if we don't have players
    if (players.length === 0) return;
    
    // Prevent excessive syncs
    const now = Date.now();
    if (now - lastSyncTimeRef.current < SYNC_THROTTLE_MS) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      
      // Schedule a sync after throttle period
      syncTimeoutRef.current = window.setTimeout(() => {
        players.forEach(player => {
          updatePlayer(player);
        });
        lastSyncTimeRef.current = Date.now();
        
        if (!initialSyncDone) {
          setInitialSyncDone(true);
          toast.info("Dati dei giocatori sincronizzati", {
            description: `${players.length} giocatori caricati correttamente`
          });
        }
      }, SYNC_THROTTLE_MS);
      
      return () => {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
      };
    }
    
    // If we're outside the throttle period, sync immediately
    console.log("Players page: Syncing players to shared context");
    players.forEach(player => {
      updatePlayer(player);
    });
    lastSyncTimeRef.current = now;
    
    if (!initialSyncDone) {
      setInitialSyncDone(true);
      toast.info("Dati dei giocatori sincronizzati", {
        description: `${players.length} giocatori caricati correttamente`
      });
    }
  }, [players, updatePlayer, initialSyncDone]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // This is a utility component that doesn't render anything visible
  return null;
});

PlayerDataSync.displayName = "PlayerDataSync";
