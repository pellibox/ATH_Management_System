
import { PersonData, ActivityData, CourtProps, ScheduleTemplate, DateSchedule, Program } from "../../types";

export interface ActionsProps {
  courts: CourtProps[];
  setCourts: React.Dispatch<React.SetStateAction<CourtProps[]>>;
  people: PersonData[];
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>;
  activities: ActivityData[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityData[]>>;
  playersList: PersonData[];
  setPlayersList: React.Dispatch<React.SetStateAction<PersonData[]>>;
  coachesList: PersonData[];
  setCoachesList: React.Dispatch<React.SetStateAction<PersonData[]>>;
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
  templates: ScheduleTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<ScheduleTemplate[]>>;
  dateSchedules: DateSchedule[];
  setDateSchedules: React.Dispatch<React.SetStateAction<DateSchedule[]>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  timeSlots: string[];
}
