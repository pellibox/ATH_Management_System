
export interface ExtraActivity {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  type?: string;
  maxParticipants?: number;
  participants?: string[];
  coach?: string;
  cost?: number;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}
