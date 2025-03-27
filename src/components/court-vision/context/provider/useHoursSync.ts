
import { useEffect, useRef } from "react";
import { PersonData } from "../../types";
import { CourtProps } from "../../types";

/**
 * Hook to sync hours between Court Vision and Players context
 * Only syncs completed and missed hours, nothing else
 */
export function useHoursSync(
  playersList: PersonData[],
  courts: CourtProps[],
  isInitialized: boolean,
  syncHours: (id: string, completedHours: number, missedHours: number) => void
) {
  // Keep track of last sync to prevent excessive updates
  const lastSyncRef = useRef<Record<string, number>>({});

  // Sync hours whenever courts change
  useEffect(() => {
    // Only sync if we're fully initialized and have courts and players
    if (!isInitialized || courts.length === 0 || playersList.length === 0) {
      console.log("useHoursSync: Skipping sync - not initialized or missing data");
      return;
    }

    console.log("useHoursSync: Checking for hours to sync", {
      playersCount: playersList.length,
      courtsCount: courts.length
    });

    // Calculate hours for each player from court assignments
    playersList.forEach(player => {
      // Get current timestamp
      const now = Date.now();
      
      // Skip if we've synced this player recently (2 second throttle)
      if (now - (lastSyncRef.current[player.id] || 0) < 2000) {
        return;
      }
      
      // Calculate hours from court assignments
      let assignedHours = 0;
      let missedHours = player.missedHours || 0;
      
      // Look through all courts and time slots for player assignments
      courts.forEach(court => {
        court.occupants
          .filter(occupant => occupant.id === player.id)
          .forEach(occupant => {
            // Add hours for this assignment
            const hours = occupant.durationHours || 1;
            assignedHours += hours;
          });
      });
      
      // Convert assignedHours to completedHours (simple mapping for now)
      const completedHours = assignedHours;
      
      // Only sync if hours have changed to avoid unnecessary updates
      if (completedHours !== player.completedHours || missedHours !== player.missedHours) {
        console.log(`useHoursSync: Syncing hours for player ${player.name}`, {
          completedHours,
          missedHours
        });
        
        // Update timestamp for this player
        lastSyncRef.current[player.id] = now;
        
        // Sync ONLY hours back to shared context
        syncHours(player.id, completedHours, missedHours);
      }
    });
  }, [courts, playersList, isInitialized, syncHours]);
}
