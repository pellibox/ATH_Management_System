
// Enhance the ExtraActivity interface to ensure it has all required properties
export interface ExtraActivity {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: string[];
  
  // Additional properties needed by the components
  days: number[];
  name?: string;
  notes?: string;
  time?: string;
  duration?: number;
  type?: string;
  
  // New properties that were missing
  location?: string;
  coach?: string;
  maxParticipants?: number;
}

// Define activity types for dropdown selections and filtering
export const ACTIVITY_TYPES = [
  { id: "athletic", name: "Atletica" },
  { id: "mental", name: "Mentale" },
  { id: "technical", name: "Tecnica" },
  { id: "tactical", name: "Tattica" },
  { id: "recovery", name: "Recupero" }
];

// Export the generateId function that was being imported
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
