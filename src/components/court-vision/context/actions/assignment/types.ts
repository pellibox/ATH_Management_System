
import { PersonData, ActivityData, CourtProps, Program } from "../../../types";

export interface AssignmentActionsProps {
  courts: CourtProps[];
  setCourts: React.Dispatch<React.SetStateAction<CourtProps[]>>;
  people: PersonData[];
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>;
  programs: Program[];
  selectedDate: Date;
  timeSlots: string[];
}

export interface PendingAssignment {
  courtId: string;
  person: PersonData;
  position?: { x: number, y: number };
  timeSlot?: string;
}
