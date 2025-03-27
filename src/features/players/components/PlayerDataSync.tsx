
import { useEffect, useState, memo, useCallback } from "react";
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

// Limitiamo la frequenza di sincronizzazione
const SYNC_THROTTLE_MS = 500;

export const PlayerDataSync = memo(() => {
  const { 
    players,
    setAvailablePrograms
  } = usePlayerContext();
  
  // Get shared player context
  const { updatePlayer, sharedPlayers, updateSharedPlayerList } = useSharedPlayers();
  
  // State to track if we've synced on load
  const [initialSyncDone, setInitialSyncDone] = useState(false);
  
  // Log shared players count for debugging
  console.log("Players page: SharedPlayers count:", sharedPlayers.length);
  console.log("Players page: Players count:", players.length);
  
  // Set available programs from TENNIS_PROGRAMS
  useEffect(() => {
    const programs = getAvailablePrograms();
    setAvailablePrograms(programs);
  }, [setAvailablePrograms]);
  
  // Force shared context to refresh when component mounts
  useEffect(() => {
    console.log("PlayerDataSync: Component mounted, forcing shared context update");
    updateSharedPlayerList();
  }, [updateSharedPlayerList]);
  
  // Memoize sync function to prevent recreating it on each render
  const syncPlayerToShared = useCallback((player) => {
    console.log("Syncing player to shared context:", player.name, player.status);
    updatePlayer(player);
  }, [updatePlayer]);
  
  // Force initial sync from Players to shared context - only do this once
  useEffect(() => {
    if (!initialSyncDone && players.length > 0) {
      console.log("Players page: Performing initial sync TO shared context");
      
      // Force sync all players to shared context
      players.forEach(player => {
        console.log("Initial sync of player to shared context:", player.name, player.status);
        syncPlayerToShared(player);
      });
      
      // Mark initial sync as done
      setInitialSyncDone(true);
      
      toast.info("Dati dei giocatori sincronizzati", {
        description: `${players.length} giocatori caricati correttamente`
      });
    }
  }, [players, initialSyncDone, syncPlayerToShared]);
  
  // Sync players with shared context
  useEffect(() => {
    // Skip if we haven't done initial sync yet
    if (!initialSyncDone) return;
    
    // Aumentiamo il delay per ridurre la frequenza di aggiornamento
    const timeoutId = setTimeout(() => {
      console.log("PlayersContent: Syncing ALL players with shared context", players.length);
      
      // Sync ALL players rather than just the last 3
      players.forEach(player => {
        syncPlayerToShared(player);
      });
    }, SYNC_THROTTLE_MS);
    
    return () => clearTimeout(timeoutId);
  }, [players, initialSyncDone, syncPlayerToShared]);

  // This is a utility component that doesn't render anything visible
  return null;
});

PlayerDataSync.displayName = "PlayerDataSync";
