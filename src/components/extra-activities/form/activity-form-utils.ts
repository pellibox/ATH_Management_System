
import { ExtraActivity } from "@/types/extra-activities";

// Default form state for a new activity
export const getDefaultActivity = (): Omit<ExtraActivity, "id"> => ({
  name: "",
  type: "athletic",
  time: "16:00",
  duration: 1,
  days: [1], // Monday by default
  location: "",
  maxParticipants: 8,
  participants: [],
  coach: "",
  notes: "",
  title: "",
  date: new Date().toISOString().split('T')[0],
  startTime: "16:00",
  endTime: "17:00"
});

// Form validation function
export const validateActivityForm = (activity: Omit<ExtraActivity, "id">): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!activity.name) errors.push("Nome attività è richiesto");
  if (!activity.location) errors.push("Ubicazione è richiesta");
  if (!activity.coach) errors.push("Coach responsabile è richiesto");
  if (activity.days.length === 0) errors.push("Seleziona almeno un giorno");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Toggle a day in the days array
export const toggleDay = (currentDays: number[], day: number): number[] => {
  if (currentDays.includes(day)) {
    return currentDays.filter(d => d !== day);
  } else {
    return [...currentDays, day];
  }
};
