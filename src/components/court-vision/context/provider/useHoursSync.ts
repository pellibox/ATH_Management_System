
import { useEffect } from "react";
import { PersonData } from "../../types";

export function useHoursSync(
  playersList: PersonData[],
  courts: any[],
  isInitialized: boolean,
  syncHours: (id: string, completedHours: number, missedHours: number) => void
) {
  // Sync back court assignments to shared context
  useEffect(() => {
    // Only sync when playersList has values and we're initialized
    if (playersList.length > 0 && isInitialized) {
      // When courts or people change, sync hours back to shared context
      playersList.forEach(player => {
        if (player.id) {
          // Sync hours only when necessary, to avoid excessive updates
          syncHours(player.id, player.completedHours || 0, player.missedHours || 0);
        }
      });
    }
  }, [courts, playersList, syncHours, isInitialized]);
}
