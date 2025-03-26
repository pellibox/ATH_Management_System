
import { CourtProps, PersonData, ActivityData } from "./types";
import { CourtContainer } from "./court/CourtContainer";

interface CourtComponentProps {
  court: CourtProps;
  date?: Date;
  timeSlots: string[];
  onDrop: (courtId: string, person: PersonData, position?: { x: number, y: number }, time?: string) => void;
  onActivityDrop: (courtId: string, activity: ActivityData, time?: string) => void;
  onRemovePerson?: (personId: string, time?: string) => void;
  onRemoveActivity?: (activityId: string, time?: string) => void;
  onRename?: (courtId: string, name: string) => void; 
  onChangeType?: (courtId: string, type: string) => void;
  onChangeNumber?: (courtId: string, number: number) => void;
  onCourtRemove?: (courtId: string) => void; 
  isSidebarCollapsed?: boolean;
  onAssignPerson?: (courtId: string, person: PersonData, timeSlot?: string, durationHours?: number) => void;
  onAssignActivity?: (courtId: string, activity: ActivityData, timeSlot?: string, durationHours?: number) => void;
  people?: PersonData[];
  activities?: ActivityData[];
  programs?: any[];
}

export function Court(props: CourtComponentProps) {
  // Simply pass all props to the CourtContainer component
  return <CourtContainer {...props} />;
}
