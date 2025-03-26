
import { PersonData, ActivityData, CourtProps } from "../types";

export interface CourtAssignmentProps {
  courts: CourtProps[];
  availablePeople: PersonData[];
  availableActivities: ActivityData[];
  timeSlots: string[]; 
  onAssignPerson: (courtId: string, person: PersonData, timeSlot?: string) => void;
  onAssignActivity: (courtId: string, activity: ActivityData, timeSlot?: string) => void;
  onRemovePerson?: (personId: string, timeSlot?: string) => void;
  onRemoveActivity?: (activityId: string, timeSlot?: string) => void;
}
