
import { PersonData, CourtProps, ActivityData, Program } from "../types";

export interface CourtVisionState {
  selectedDate: Date;
  templates: any[];
  dateSchedules: any[];
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
  pendingAssignment: any;
}

export interface CourtVisionContextType {
  // State properties
  selectedDate: Date;
  templates: any[];
  dateSchedules: any[];
  timeSlots: string[];
  courts: any[];
  filteredCourts: any[];
  people: any[];
  activities: any[];
  playersList: any[];
  coachesList: any[];
  programs: any[];
  filteredPlayers: any[];
  filteredCoaches: any[];
  currentSport: string;
  isLayoutView: boolean;

  // Actions & setters
  setSelectedDate: (date: Date) => void;
  handleDrop: (courtId: string, person: any, position?: any, timeSlot?: string) => void;
  handleRemovePerson: (personId: string, timeSlot?: string) => void;
  handleActivityDrop: (courtId: string, activity: any, timeSlot?: string) => void;
  handleRemoveActivity: (activityId: string, timeSlot?: string) => void;
  handleAddToDragArea: (personId: string) => void;
  handleAssignPlayerToActivity: (personId: string, activityId: string) => void;
  handleAssignProgram: (personId: string, programId: string) => void;
  handleCreateProgram: (program: any) => void;
  handleUpdateProgram: (programId: string, program: any) => void;
  handleDeleteProgram: (programId: string) => void;
  handleSetCoachAvailability: (coachId: string, isPresent: boolean, reason?: string) => void;
  
  // Extra hours dialog state and handlers
  showExtraHoursDialog: boolean;
  setShowExtraHoursDialog: (show: boolean) => void;
  pendingAssignment: any;
  getCurrentHours: () => number;
  getNewHours: () => number;
  handleConfirmExtraHours: () => void;
  handleCancelExtraHours: () => void;
  
  // Coach overlap dialog state and handlers
  showCoachOverlapDialog: boolean;
  setShowCoachOverlapDialog: (show: boolean) => void;
  pendingCoachAssignment: {
    courtId: string;
    coach: any;
    position?: { x: number; y: number };
    timeSlot?: string;
    existingCourtName: string;
  } | null;
  handleConfirmCoachOverlap: () => void;
  handleCancelCoachOverlap: () => void;

  // Schedule actions
  handleSaveTemplate: (name: string) => void;
  saveAsTemplate: (name: string) => void;
  handleLoadTemplate: (templateId: string) => void;
  applyTemplate: (template: any) => void;
  handleDeleteTemplate: (templateId: string) => void;
  handleClearSchedule: () => void;
  handleDuplicateSchedule: (sourceDate: Date, targetDate: Date) => void;
  copyToNextDay: () => void;
  copyToWeek: () => void;
  checkUnassignedPeople: () => any[];
  
  // Court actions
  handleAddCourt: (court: CourtProps) => void;
  handleUpdateCourt: (courtId: string, court: Partial<CourtProps>) => void;
  handleRemoveCourt: (courtId: string) => void;
  handleRenameCourt: (courtId: string, name: string) => void;
  handleChangeCourtType: (courtId: string, type: string) => void;
  handleChangeCourtNumber: (courtId: string, number: number) => void;
  
  // People actions
  handleAddPerson: (person: PersonData) => void;
  handleAddPlayer: (player: PersonData) => void;
  handleUpdatePlayer: (playerId: string, player: Partial<PersonData>) => void;
  handleRemovePlayer: (playerId: string) => void;
  handleAddCoach: (coach: PersonData) => void;
  handleUpdateCoach: (coachId: string, coach: Partial<PersonData>) => void;
  handleRemoveCoach: (coachId: string) => void;
  
  // Activity actions
  handleAddActivity: (activity: ActivityData | {name: string, type: string, duration: string}) => void;
  handleUpdateActivity: (activityId: string, activity: Partial<ActivityData>) => void;
}
