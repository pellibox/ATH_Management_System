
import { 
  PersonData, 
  ActivityData, 
  CourtProps, 
  ScheduleTemplate, 
  DateSchedule,
  Program 
} from "../types";

export interface CourtVisionProviderProps {
  children: React.ReactNode;
}

export type CourtVisionState = {
  selectedDate: Date;
  templates: ScheduleTemplate[];
  dateSchedules: DateSchedule[];
  timeSlots: string[];
  courts: CourtProps[];
  filteredCourts: CourtProps[];
  people: PersonData[];
  activities: ActivityData[];
  playersList: PersonData[];
  coachesList: PersonData[];
  programs: Program[];
  filteredPlayers: PersonData[];
  filteredCoaches: PersonData[];
  currentSport: string;
  isLayoutView: boolean;
  showExtraHoursDialog: boolean;
  pendingAssignment: {
    courtId: string;
    person: PersonData;
    position?: { x: number, y: number };
    timeSlot?: string;
  } | null;
};
