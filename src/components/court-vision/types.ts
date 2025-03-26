
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
  hoursAssigned?: number; // Total hours assigned in current week
  sportTypes?: string[]; // Multiple sport types the person can participate in
  email?: string; // Contact information
  phone?: string; // Contact information
  address?: string; // Address information
  birthDate?: string; // Birth date
  notes?: string; // Additional notes
  preferredContactMethod?: "WhatsApp" | "Email" | "Phone"; // Preferred contact method for sending schedules
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
