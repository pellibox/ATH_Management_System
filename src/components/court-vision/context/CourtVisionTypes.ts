
import { 
  PersonData, 
  ActivityData, 
  CourtProps, 
  ScheduleTemplate, 
  DateSchedule,
  Program 
} from "../types";

export interface CourtVisionContextType {
  // State
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

  // Actions
  setSelectedDate: (date: Date) => void;
  handleDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  handleActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  handleRemovePerson: (personId: string, timeSlot?: string) => void;
  handleRemoveActivity: (activityId: string, timeSlot?: string) => void;
  handleAddPerson: (personData: {name: string, type: string, email?: string, phone?: string, sportTypes?: string[]}) => void;
  handleAddActivity: (activityData: {name: string, type: string, duration: string}) => void;
  saveAsTemplate: (name: string) => void;
  applyTemplate: (template: ScheduleTemplate) => void;
  copyToNextDay: () => void;
  copyToWeek: () => void;
  checkUnassignedPeople: (scheduleType: "day" | "week" | "month") => PersonData[];
  handleAddToDragArea: (person: PersonData) => void;
  handleRenameCourt: (courtId: string, name: string) => void;
  handleChangeCourtType: (courtId: string, type: string) => void;
  handleChangeCourtNumber: (courtId: string, number: number) => void;
  handleAssignProgram: (personId: string, programId: string) => void;
  handleAddProgram: (program: Program) => void;
  handleRemoveProgram: (programId: string) => void;
  handleSetCoachAvailability: (coachId: string, isPresent: boolean, reason?: string) => void;
  handleAssignPlayerToActivity: (activityId: string, playerId: string) => void;
  
  // Dialog state and handlers
  showExtraHoursDialog: boolean;
  setShowExtraHoursDialog: React.Dispatch<React.SetStateAction<boolean>>;
  pendingAssignment: { courtId: string; person: PersonData; position?: { x: number, y: number }; timeSlot?: string; } | null;
  getCurrentHours: () => number;
  getNewHours: () => number;
  handleConfirmExtraHours: () => void;
  handleCancelExtraHours: () => void;
}
