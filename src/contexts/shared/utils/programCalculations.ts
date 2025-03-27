
import { Player } from "@/types/player";
import { PersonData } from "@/components/court-vision/types";

// Calculate daily limit based on program
export const calculateDailyLimit = (player: Player | PersonData): number => {
  if (!player.program && !player.programId) return 2;
  
  const programId = player.program || player.programId;
  
  // Program-specific daily limits
  const programLimits: Record<string, number> = {
    "perf2": 3,
    "perf3": 4.5,
    "perf4": 6,
    "elite": 7.5,
    "elite-full": 10,
    "junior-sit": 3,
    "junior-sat": 1.5,
    "Future Champions": 4,
    "Performance": 6,
    "Elite": 8
  };
  
  return programLimits[programId as string] || 2;
};

// Calculate default duration based on program
export const calculateDefaultDuration = (player: Player | PersonData): number => {
  if (!player.program && !player.programId) return 1;
  
  const programId = player.program || player.programId;
  
  // Program-specific durations
  const programDurations: Record<string, number> = {
    "perf2": 1.5,
    "perf3": 1.5,
    "perf4": 1.5,
    "elite": 1.5,
    "elite-full": 2,
    "junior-sit": 1,
    "junior-sat": 1,
    "Future Champions": 1.5,
    "Performance": 1.5,
    "Elite": 2
  };
  
  return programDurations[programId as string] || 1;
};
