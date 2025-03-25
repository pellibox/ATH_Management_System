export interface PersonData {
  id: string;
  name: string;
  type: string;
  courtId?: string;
  position?: { x: number; y: number };
  timeSlot?: string;
  date?: string; // ISO date string
  durationHours?: number; // Duration in hours
  endTimeSlot?: string; // End time slot for spanning multiple slots
  programId?: string; // Program assignment
  programColor?: string; // Color for visual representation
  sourceTimeSlot?: string; // Source time slot for drag and drop operations
}

export interface ActivityData {
  id: string;
  name: string;
  type: string;
  courtId?: string;
  duration?: string;
  startTime?: string;
  date?: string; // ISO date string
  durationHours?: number; // Duration in hours
  endTimeSlot?: string; // End time slot for spanning multiple slots
  sourceTimeSlot?: string; // Source time slot for drag and drop operations
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
}
