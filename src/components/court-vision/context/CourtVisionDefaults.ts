
import { PersonData, ActivityData, CourtProps, Program } from "../types";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES, DEFAULT_PROGRAMS as PROGRAM_DEFAULTS } from "../constants";

export const DEFAULT_TIME_SLOTS: string[] = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

export const DEFAULT_COURTS: CourtProps[] = [
  { id: "court1", type: COURT_TYPES.TENNIS_CLAY, name: "Center Court", number: 1, occupants: [], activities: [] },
  { id: "court2", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 2, occupants: [], activities: [] },
  { id: "court3", type: COURT_TYPES.TENNIS_CLAY, name: "Tennis", number: 3, occupants: [], activities: [] },
  { id: "court5", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 5, occupants: [], activities: [] },
  { id: "court6", type: COURT_TYPES.TENNIS_HARD, name: "Tennis", number: 6, occupants: [], activities: [] },
  { id: "padel1", type: COURT_TYPES.PADEL, name: "Padel", number: 1, occupants: [], activities: [] },
  { id: "padel2", type: COURT_TYPES.PADEL, name: "Padel", number: 2, occupants: [], activities: [] },
  { id: "pickleball1", type: COURT_TYPES.PICKLEBALL, name: "Pickleball", number: 1, occupants: [], activities: [] },
  { id: "touchtennis1", type: COURT_TYPES.TOUCH_TENNIS, name: "Touch Tennis", number: 1, occupants: [], activities: [] },
];

export const DEFAULT_PEOPLE: PersonData[] = [
  { id: "player1", name: "Alex Smith", type: PERSON_TYPES.PLAYER },
  { id: "player2", name: "Emma Johnson", type: PERSON_TYPES.PLAYER },
  { id: "player3", name: "Michael Brown", type: PERSON_TYPES.PLAYER },
  { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH },
  { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH },
];

export const DEFAULT_ACTIVITIES: ActivityData[] = [
  { id: "activity1", name: "Singles Match", type: ACTIVITY_TYPES.MATCH, duration: "1h" },
  { id: "activity2", name: "Group Training", type: ACTIVITY_TYPES.TRAINING, duration: "1.5h" },
  { id: "activity3", name: "Basket Drill", type: ACTIVITY_TYPES.BASKET_DRILL, duration: "45m" },
];

export const DEFAULT_PLAYERS: PersonData[] = [
  { id: "player1", name: "Alex Smith", type: PERSON_TYPES.PLAYER, sportTypes: ["tennis"] },
  { id: "player2", name: "Emma Johnson", type: PERSON_TYPES.PLAYER, sportTypes: ["tennis"] },
  { id: "player3", name: "Michael Brown", type: PERSON_TYPES.PLAYER, sportTypes: ["tennis"] },
  { id: "player4", name: "Sophia Davis", type: PERSON_TYPES.PLAYER, sportTypes: ["padel"] },
  { id: "player5", name: "James Wilson", type: PERSON_TYPES.PLAYER, sportTypes: ["pickleball"] },
];

export const DEFAULT_COACHES: PersonData[] = [
  { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH, sportTypes: ["tennis"] },
  { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH, sportTypes: ["padel"] },
  { id: "coach3", name: "Coach Thompson", type: PERSON_TYPES.COACH, sportTypes: ["tennis"] },
];

export const DEFAULT_PROGRAMS = PROGRAM_DEFAULTS;
