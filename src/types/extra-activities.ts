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
}
