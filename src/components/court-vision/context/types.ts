
import { ReactNode } from "react";
import { PersonData } from "../types";

export interface CourtVisionProviderProps {
  children: ReactNode;
}

export interface CourtVisionState {
  selectedDate: Date;
  templates: any[];
  dateSchedules: any[];
  timeSlots: string[];
  courts: any[];
  filteredCourts: any[];
  people: PersonData[];
  activities: any[];
  playersList: PersonData[];
  coachesList: PersonData[];
  programs: any[];
  filteredPlayers: PersonData[];
  filteredCoaches: PersonData[];
  currentSport: string;
  isLayoutView: boolean;
  showExtraHoursDialog: boolean;
  pendingAssignment: any;
}
