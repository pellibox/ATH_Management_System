
import { ProgramDetails } from './interfaces';

// Standard program details map
export const programDetailsMap: Record<string, ProgramDetails> = {
  "Junior Excellence": { weeks: 40, sessionsPerWeek: 3, hoursPerSession: 1 },
  "Elite Performance": { weeks: 40, sessionsPerWeek: 5, hoursPerSession: 1.5 },
  "Foundation": { weeks: 30, sessionsPerWeek: 2, hoursPerSession: 1 },
  "Pro Circuit": { weeks: 48, sessionsPerWeek: 6, hoursPerSession: 2 },
};

// Calculate total hours for a program
export const calculateProgramHours = (programName: string): number => {
  if (!programName || !programDetailsMap[programName]) return 0;
  
  const details = programDetailsMap[programName];
  return details.weeks * details.sessionsPerWeek * details.hoursPerSession;
};
