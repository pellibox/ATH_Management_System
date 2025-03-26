
import { PersonData, ActivityData, CourtProps, Program } from "../types";
import { COURT_TYPES, PERSON_TYPES, ACTIVITY_TYPES, DEFAULT_PROGRAMS as PROGRAM_DEFAULTS } from "../constants";

export const DEFAULT_TIME_SLOTS = [
  "08:00", "08:30", 
  "09:00", "09:30", 
  "10:00", "10:30", 
  "11:00", "11:30", 
  "12:00", "12:30", 
  "13:00", "13:30", 
  "14:00", "14:30", 
  "15:00", "15:30", 
  "16:00", "16:30", 
  "17:00", "17:30", 
  "18:00", "18:30", 
  "19:00", "19:30",
  "20:00", "20:30"
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
  { id: "player1", name: "Giulia Bianchi", type: PERSON_TYPES.PLAYER, email: "giulia.bianchi@example.com" },
  { id: "player2", name: "Luca Verdi", type: PERSON_TYPES.PLAYER, email: "luca.verdi@example.com" },
  { id: "player3", name: "Marco Rossi", type: PERSON_TYPES.PLAYER, email: "marco.rossi@example.com" },
  { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH, email: "anderson@example.com" },
  { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH, email: "martinez@example.com" },
];

export const DEFAULT_ACTIVITIES: ActivityData[] = [
  { id: "activity1", name: "Singles Match", type: ACTIVITY_TYPES.MATCH, duration: "1h" },
  { id: "activity2", name: "Group Training", type: ACTIVITY_TYPES.TRAINING, duration: "1.5h" },
  { id: "activity3", name: "Basket Drill", type: ACTIVITY_TYPES.BASKET_DRILL, duration: "45m" },
];

export const DEFAULT_PLAYERS: PersonData[] = [
  { id: "player1", name: "Giulia Bianchi", type: PERSON_TYPES.PLAYER, sportTypes: ["tennis"], email: "giulia.bianchi@example.com", programId: "elite" },
  { id: "player2", name: "Luca Verdi", type: PERSON_TYPES.PLAYER, sportTypes: ["tennis"], email: "luca.verdi@example.com", programId: "foundation" },
  { id: "player3", name: "Marco Rossi", type: PERSON_TYPES.PLAYER, sportTypes: ["tennis"], email: "marco.rossi@example.com", programId: "junior" },
  { id: "player4", name: "Sofia Marino", type: PERSON_TYPES.PLAYER, sportTypes: ["padel"], email: "sofia.marino@example.com", programId: "pro" },
  { id: "player5", name: "Andrea Esposito", type: PERSON_TYPES.PLAYER, sportTypes: ["pickleball"], email: "andrea.esposito@example.com" },
];

export const DEFAULT_COACHES: PersonData[] = [
  { id: "coach1", name: "Coach Anderson", type: PERSON_TYPES.COACH, sportTypes: ["tennis"], email: "anderson@example.com" },
  { id: "coach2", name: "Coach Martinez", type: PERSON_TYPES.COACH, sportTypes: ["padel"], email: "martinez@example.com" },
  { id: "coach3", name: "Coach Thompson", type: PERSON_TYPES.COACH, sportTypes: ["tennis"], email: "thompson@example.com" },
];

export const DEFAULT_PROGRAMS = PROGRAM_DEFAULTS;
