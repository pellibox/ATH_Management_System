
import { PersonData } from "../../../types";
import { PERSON_TYPES } from "../../../constants";

// Helper to calculate exact duration from hours that may be fractions
export const calculateSlotsDuration = (hours: number): number => {
  // For 30-minute time slots, multiply by 2 to get number of slots
  return Math.ceil(hours * 2);
};

// Helper to get duration hours from string
export const getActivityDurationHours = (duration?: string): number => {
  if (!duration) return 1;
  if (duration === "30m") return 0.5;
  if (duration === "45m") return 0.75;
  if (duration === "1h") return 1;
  if (duration === "1.5h") return 1.5;
  if (duration === "2h") return 2;
  return 1; // Default
};

// Helper function to check if a player already has assignments for the day
export const getPlayerDailyHours = (playerId: string, courts: any[]): number => {
  let totalHours = 0;
  courts.forEach(court => {
    court.occupants
      .filter((p: PersonData) => p.id === playerId && p.type === PERSON_TYPES.PLAYER)
      .forEach((p: PersonData) => {
        totalHours += p.durationHours || 1;
      });
  });
  
  // Also add hours from activities
  courts.forEach(court => {
    court.activities.forEach((activity: any) => {
      // Check if this activity has assigned participants that include this player
      if (activity.participants && activity.participants.includes(playerId)) {
        totalHours += activity.durationHours || 1;
      }
    });
  });
  
  return totalHours;
};
