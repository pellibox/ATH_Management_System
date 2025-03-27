
import { CourtProps, PersonData, ActivityData } from "../types";

export interface CourtGroupProps {
  type: string;
  courts: CourtProps[];
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, name: string) => void;
  onChangeCourtType: (courtId: string, type: string) => void;
  onChangeCourtNumber: (courtId: string, number: number) => void;
  activeHoursByGroup: Record<string, string | null>;
  visibleCourtIndices: Record<string, number>;
  handleHourChangeForGroup: (groupId: string, hour: string) => void;
  navigateCourt: (type: string, pairIndex: number, direction: 'next' | 'prev') => void;
  isMobile: boolean;
  getGroupId: (type: string, pairIndex: number) => string;
}

export interface CourtPairProps {
  courtPair: CourtProps[];
  type: string;
  pairIndex: number;
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, name: string) => void;
  onChangeCourtType: (courtId: string, type: string) => void;
  onChangeCourtNumber: (courtId: string, number: number) => void;
  activeHoursByGroup: Record<string, string | null>;
  visibleCourtIndices: Record<string, number>;
  handleHourChangeForGroup: (groupId: string, hour: string) => void;
  navigateCourt: (type: string, pairIndex: number, direction: 'next' | 'prev') => void;
  isMobile: boolean;
  getGroupId: (type: string, pairIndex: number) => string;
}

export interface GlobalControlsProps {
  timeSlots: string[];
  syncAllSliders: (hour: string) => void;
  currentBusinessHour: string | null;
  diagnosticMode: boolean;
  setDiagnosticMode: (mode: boolean) => void;
}

export interface CourtGridProps {
  courts: CourtProps[];
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, name: string) => void;
  onChangeCourtType: (courtId: string, type: string) => void;
  onChangeCourtNumber: (courtId: string, number: number) => void;
  activeHour?: string | null;
}
