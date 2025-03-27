import { ReactNode } from "react";
import { PersonData, ActivityData, CourtProps } from "../types";

export interface CourtGridProps {
  courts: CourtProps[];
  availablePeople: PersonData[];
  availableActivities: ActivityData[];
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string, courtId?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string, courtId?: string) => void;
  onAddCourt?: () => void;
  onDeleteCourt?: (courtId: string) => void;
  onRenameCourt?: (courtId: string, newName: string) => void;
  onChangeCourtType?: (courtId: string, newType: string) => void;
  onChangeCourtNumber?: (courtId: string, newNumber: number) => void;
  onScheduleExport?: () => void;
  children?: ReactNode;
  activeHour?: string;
  onHourChange?: (hour: string) => void;
  visibleCourtIndices?: number[];
  defaultActiveHour?: string;
  ref?: React.ForwardedRef<HTMLDivElement>;
}

export interface GlobalControlsProps {
  timeSlots: string[];
  syncAllSliders: (hour: string) => void;
  currentBusinessHour: string | null;
  diagnosticMode: boolean;
  setDiagnosticMode: (mode: boolean) => void;
}

export interface CourtGroupProps {
  type: string;
  courts: CourtProps[];
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, timeSlot?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson: (personId: string, timeSlot?: string) => void;
  onRemoveActivity: (activityId: string, timeSlot?: string) => void;
  onRenameCourt?: (courtId: string, newName: string) => void;
  onChangeCourtType?: (courtId: string, newType: string) => void;
  onChangeCourtNumber?: (courtId: string, newNumber: number) => void;
  activeHoursByGroup: Record<string, string | null>;
  visibleCourtIndices?: number[];
  handleHourChangeForGroup: (hour: string, groupId: string) => void;
  navigateCourt: (courtId: string) => void;
  isMobile: boolean;
  getGroupId: (type: string) => string;
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
  onRenameCourt?: (courtId: string, newName: string) => void;
  onChangeCourtType?: (courtId: string, newType: string) => void;
  onChangeCourtNumber?: (courtId: string, newNumber: number) => void;
  activeHoursByGroup: Record<string, string | null>;
  visibleCourtIndices?: number[];
  handleHourChangeForGroup: (hour: string, groupId: string) => void;
  navigateCourt: (courtId: string) => void;
  isMobile: boolean;
  getGroupId: (type: string) => string;
}
