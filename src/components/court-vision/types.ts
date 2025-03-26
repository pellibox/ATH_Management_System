
export interface PersonData {
  id: string;
  name: string;
  type: string;
  assigned?: boolean;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  programId?: string; // For single program assignment
  programIds?: string[]; // For multiple program assignments
  sportTypes?: string[];
  timeSlot?: string; // Time slot for scheduling
  courtId?: string; // Court assignment
  durationHours?: number; // Duration in hours
  hoursAssigned?: number; // Total hours assigned
  programColor?: string; // Color based on program
  position?: { x: number, y: number }; // Position for drag and drop
  sourceTimeSlot?: string; // Source time slot for drag operations
  isPresent?: boolean; // Whether coach is present
  absenceReason?: string; // Reason for coach absence
  preferredContactMethod?: string; // Contact preference
  activityHistory?: ActivityHistoryEntry[]; // Track activities player has participated in
  endTimeSlot?: string; // End time slot for spanning multiple slots
}

export interface ActivityHistoryEntry {
  activityId: string;
  activityName: string;
  activityType: string;
  date: string; // ISO date string
  courtId?: string;
  courtName?: string;
  duration: number; // Duration in hours
  timeSlot?: string;
}

export interface ActivityData {
  id: string;
  name: string;
  type: string;
  courtId?: string;
  duration?: string;
  startTime?: string;
  timeSlot?: string; // Add this to fix the error
  date?: string; // ISO date string
  durationHours?: number; // Duration in hours
  endTimeSlot?: string; // End time slot for spanning multiple slots
  sourceTimeSlot?: string; // Source time slot for drag and drop operations
  sportType?: string; // Type of sport (tennis, padel, pickleball, touchtennis)
  participants?: string[]; // Array of player IDs who are part of this activity
}

export interface CourtProps {
  id: string;
  type: string;
  name: string;
  number: number;
  occupants: PersonData[];
  activities: ActivityData[];
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  date: Date;
  courts: CourtProps[];
}

export interface DateSchedule {
  date: string; // ISO date string
  courts: CourtProps[];
}

export interface Program {
  id: string;
  name: string;
  color: string;
  weeklyHours?: number; // Weekly hours assigned to this program
  totalWeeks?: number; // Total weeks for the program duration
  remainingWeeks?: number; // Remaining weeks in the program
}
