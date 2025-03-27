
import { CourtProps } from "../types";

export interface CourtGroupProps {
  type: string;
  courts: CourtProps[];
  timeSlots: string[];
  onDrop: (courtId: string, personId: string, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activityId: string, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, newName: string) => void;
  onChangeCourtType: (courtId: string, newType: string) => void;
  onChangeCourtNumber: (courtId: string, newNumber: number) => void;
  activeHoursByGroup: Record<string, string>;
  visibleCourtIndices: Record<string, number>;
  handleHourChangeForGroup: (hour: string, groupId: string) => void;
  navigateCourt: (key: string, direction: 'prev' | 'next') => void;
  isMobile: boolean;
  getGroupId: (type: string) => string;
}

export interface CourtPairProps {
  courtPair: CourtProps[];
  type: string;
  pairIndex: number;
  timeSlots: string[];
  onDrop: (courtId: string, personId: string, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activityId: string, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, newName: string) => void;
  onChangeCourtType: (courtId: string, newType: string) => void;
  onChangeCourtNumber: (courtId: string, newNumber: number) => void;
  activeHoursByGroup: Record<string, string>;
  visibleCourtIndices: Record<string, number>;
  handleHourChangeForGroup: (hour: string, groupId: string) => void;
  navigateCourt: (key: string, direction: 'prev' | 'next') => void;
  isMobile: boolean;
  getGroupId: (type: string) => string;
}

export interface CourtGridProps {
  courts: CourtProps[];
  availablePeople: any[];
  availableActivities: any[];
  timeSlots: string[];
  onDrop: (courtId: string, personId: string, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activityId: string, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt: (courtId: string, newName: string) => void;
  onChangeCourtType: (courtId: string, newType: string) => void;
  onChangeCourtNumber: (courtId: string, newNumber: number) => void;
  activeHour?: string | null;
}

export interface GlobalControlsProps {
  timeSlots: string[];
  syncAllSliders: (hour: string) => void;
  currentBusinessHour: string | undefined;
  diagnosticMode: boolean;
  setDiagnosticMode: (mode: boolean) => void;
}
