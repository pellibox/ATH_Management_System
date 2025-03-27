
export interface ExtraActivity {
  id: string;
  title?: string;
  name: string;
  description?: string;
  date?: string;
  time: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  location: string;
  type: string;
  days: number[];
  maxParticipants: number;
  participants: string[];
  coach: string;
  cost?: number;
  notes?: string;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

// Utility function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Activity types definition
export const ACTIVITY_TYPES = [
  { id: "athletic", name: "Preparazione Atletica" },
  { id: "mental", name: "Preparazione Mentale" },
  { id: "technical", name: "Tecnica" },
  { id: "tactical", name: "Tattica" },
  { id: "analysis", name: "Analisi Video" },
  { id: "other", name: "Altro" }
];
