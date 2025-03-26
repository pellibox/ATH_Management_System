
import { PersonData, ActivityData } from "../../../types";

export interface PeopleManagementProps {
  people: PersonData[];
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>;
  playersList: PersonData[];
  setPlayersList: React.Dispatch<React.SetStateAction<PersonData[]>>;
  coachesList: PersonData[];
  setCoachesList: React.Dispatch<React.SetStateAction<PersonData[]>>;
}

export interface ActivityManagementProps {
  activities: ActivityData[];
  setActivities: React.Dispatch<React.SetStateAction<ActivityData[]>>;
}

export interface ProgramAssignmentProps {
  playersList: PersonData[];
  setPlayersList: React.Dispatch<React.SetStateAction<PersonData[]>>;
  coachesList: PersonData[];
  setCoachesList: React.Dispatch<React.SetStateAction<PersonData[]>>;
  programs: any[];
  courts: any[];
}

export interface CoachAvailabilityProps {
  coachesList: PersonData[];
  setCoachesList: React.Dispatch<React.SetStateAction<PersonData[]>>;
  people: PersonData[];
  setPeople: React.Dispatch<React.SetStateAction<PersonData[]>>;
  courts: any[];
}
