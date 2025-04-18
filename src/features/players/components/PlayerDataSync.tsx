
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
    setAvailablePrograms,
    setPlayers
  } = usePlayerContext();
  
  // Get shared player context for syncing operations
  const { 
    updatePlayer, 
    syncHours,
    sharedPlayers 
  } = useSharedPlayers();
  
  // State to track if we've synced on load
  const [initialSyncDone, setInitialSyncDone] = useState(false);
  
  // Refs to prevent excessive syncs
  const syncTimeoutRef = useRef<number | null>(null);
  const lastSyncTimeRef = useRef<number>(0);
  
  // Set available programs from TENNIS_PROGRAMS
  useEffect(() => {
    const programs = getAvailablePrograms();
    setAvailablePrograms(programs);
  }, [setAvailablePrograms]);
  
  // HOURS SYNC: Court Vision → Players 
  // Only sync hours from sharedPlayers back to players
  useEffect(() => {
    if (sharedPlayers.length === 0 || players.length === 0) return;
    
    // Find players in the Players section that need hours updated from Court Vision
    players.forEach(player => {
      const sharedPlayer = sharedPlayers.find(sp => sp.id === player.id);
      if (sharedPlayer) {
        // Check if hours data has changed
        if (
          sharedPlayer.completedHours !== player.completedHours ||
          sharedPlayer.missedHours !== player.missedHours
        ) {
          console.log(`PlayerDataSync: Syncing hours for ${player.name} from Court Vision to Players`, {
            completedHours: sharedPlayer.completedHours,
            missedHours: sharedPlayer.missedHours
          });
          
          // Update player with new hours data while preserving all other data
          setPlayers(prev => prev.map(p => 
            p.id === player.id 
              ? { 
                  ...p, 
                  completedHours: sharedPlayer.completedHours,
                  missedHours: sharedPlayer.missedHours
                } 
              : p
          ));
        }
      }
    });
  }, [sharedPlayers, players, setPlayers]);
  
  // PRIMARY SYNC: Players → Shared Context (one-way sync)
  // This sends data FROM Players TO Court Vision, but preserves player core data
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
        console.log("PlayerDataSync: Running throttled sync of players to shared context");
        
        // Primary sync: update all active players to shared context
        // Only send player data TO Court Vision (one-way sync)
        players.forEach(player => {
          // Send player data to shared context - Court Vision will only use players with a program
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
    console.log("PlayerDataSync: Syncing players to shared context");
    
    // Primary sync: update all active players to shared context
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
