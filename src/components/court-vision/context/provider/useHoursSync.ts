
import { useEffect, useRef } from "react";
import { PersonData } from "../../types";

export function useHoursSync(
  playersList: PersonData[],
  courts: any[],
  isInitialized: boolean,
  syncHours: (id: string, completedHours: number, missedHours: number) => void
) {
  // Track last sync to avoid too frequent updates
  const lastSyncRef = useRef<Record<string, number>>({});
  
  // Sync hours data from Court Vision to Players page
  useEffect(() => {
    if (!isInitialized || playersList.length === 0 || courts.length === 0) return;
    
    // Calculate hours for each player from court assignments
    playersList.forEach(player => {
      // Skip if not a player or doesn't have an ID
      if (player.type !== "player" || !player.id) return;
      
      // Find all occurrences of this player in courts
      let totalAssignedHours = 0;
      let totalMissedHours = player.missedHours || 0; // Preserve missed hours
      
      // Count how many hours this player is assigned
      courts.forEach(court => {
        court.occupants.forEach((occupant: PersonData) => {
          if (occupant.id === player.id && occupant.timeSlot) {
            // Calculate hours from assigned time slots
            if (occupant.endTimeSlot && occupant.timeSlot) {
              // If we have both start and end time slots, calculate duration
              const startTime = occupant.timeSlot.split(":").map(Number);
              const endTime = occupant.endTimeSlot.split(":").map(Number);
              
              // Convert to minutes and calculate difference
              const startMinutes = startTime[0] * 60 + startTime[1];
              const endMinutes = endTime[0] * 60 + endTime[1];
              const durationHours = (endMinutes - startMinutes) / 60;
              
              totalAssignedHours += durationHours;
            } else if (occupant.durationHours) {
              // If we have explicit duration hours
              totalAssignedHours += occupant.durationHours;
            } else {
              // Default to 1 hour per assignment
              totalAssignedHours += 1;
            }
          }
        });
      });
      
      // Only sync if hours have changed and not too frequently
      const now = Date.now();
      const lastSync = lastSyncRef.current[player.id] || 0;
      
      if (
        (totalAssignedHours !== player.completedHours || 
         totalMissedHours !== player.missedHours) && 
        now - lastSync > 1000
      ) {
        console.log(`useHoursSync: Syncing hours for ${player.name}`, {
          previousCompleted: player.completedHours,
          newCompleted: totalAssignedHours,
          previousMissed: player.missedHours,
          newMissed: totalMissedHours
        });
        
        // Update last sync time
        lastSyncRef.current[player.id] = now;
        
        // Only sync hours data back to Players page
        syncHours(player.id, totalAssignedHours, totalMissedHours);
      }
    });
  }, [playersList, courts, isInitialized, syncHours]);
}
