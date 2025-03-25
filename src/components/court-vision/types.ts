
export interface PersonData {
  id: string;
  name: string;
  type: string;
  courtId?: string;
  position?: { x: number; y: number };
  timeSlot?: string;
  date?: string; // ISO date string
}

export interface ActivityData {
  id: string;
  name: string;
  type: string;
  courtId?: string;
  duration?: string;
  startTime?: string;
  date?: string; // ISO date string
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
