
import { Player } from "@/types/player";

// Helper function to calculate daily limit based on program
export function calculateDailyLimit(player: Player): number {
  if (!player.program) return 2;
  
  // Program-specific daily limits
  const programLimits: Record<string, number> = {
    "perf2": 3,
    "perf3": 4.5,
    "perf4": 6,
    "elite": 7.5,
    "elite-full": 10,
    "junior-sit": 3,
    "junior-sat": 1.5,
  };
  
  return programLimits[player.program] || 2;
}

// Helper function to calculate default duration based on program
export function calculateDefaultDuration(player: Player): number {
  if (!player.program) return 1;
  
  // Program-specific durations
  const programDurations: Record<string, number> = {
    "perf2": 1.5,
    "perf3": 1.5,
    "perf4": 1.5,
    "elite": 1.5,
    "elite-full": 2,
    "junior-sit": 1,
    "junior-sat": 1,
  };
  
  return programDurations[player.program] || 1;
}
