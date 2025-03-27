
import { CourtProps, PersonData, ActivityData } from "../types";

export interface CourtGridProps {
  courts: CourtProps[];
  timeSlots: string[];
  availablePeople: PersonData[];
  availableActivities: ActivityData[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number; y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, name: string) => void;
  onChangeCourtType: (courtId: string, type: string) => void;
  onChangeCourtNumber: (courtId: string, number: number) => void;
  activeHour?: string;
}

export interface GlobalControlsProps {
  timeSlots: string[];
  syncAllSliders: (hour: string) => void;  // Changed from number to string
  currentBusinessHour: string | null;      // Changed from number to string
  diagnosticMode: boolean;
  setDiagnosticMode: (value: boolean) => void;
  showOnlyConflicts: boolean;
  setShowOnlyConflicts: (value: boolean) => void;
  conflictsCount: number;
}

export interface CourtGroupProps {
  type: string;
  courts: CourtProps[];
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number; y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, name: string) => void;
  onChangeCourtType: (courtId: string, type: string) => void;
  onChangeCourtNumber: (courtId: string, number: number) => void;
  activeHoursByGroup: Record<string, string | null>;
  visibleCourtIndices: Record<string, number>;  // Changed from number[] to number
  handleHourChangeForGroup: (groupId: string, hour: string) => void;
  navigateCourt: (type: string, pairIndex: number, direction: "next" | "prev") => void;
  isMobile: boolean;
  getGroupId: (type: string, pairIndex?: number) => string;  // Added optional pairIndex
}

export interface CourtPairProps {
  courtPair: CourtProps[];
  type: string;
  pairIndex: number;
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number; y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, name: string) => void;
  onChangeCourtType: (courtId: string, type: string) => void;
  onChangeCourtNumber: (courtId: string, number: number) => void;
  activeHoursByGroup: Record<string, string | null>;
  visibleCourtIndices: Record<string, number>;  // Changed from number[] to number
  handleHourChangeForGroup: (groupId: string, hour: string) => void;
  navigateCourt: (type: string, pairIndex: number, direction: "next" | "prev") => void;
  isMobile: boolean;
  getGroupId: (type: string, pairIndex?: number) => string;  // Added optional pairIndex
}
