
export interface ExtraActivity {
  id: string;
  name: string;
  type: string;
  time: string;
  duration: number;
  days: number[];
  location: string;
  maxParticipants: number;
  participants: string[];
  coach: string;
  notes?: string;
}

export const ACTIVITY_TYPES = [
  { id: "athletic", name: "Atletica" },
  { id: "mental", name: "Preparazione Mentale" },
  { id: "physio", name: "Fisioterapia" },
  { id: "nutrition", name: "Nutrizione" },
  { id: "video", name: "Analisi Video" }
];

export const generateId = () => `extra-activity-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
