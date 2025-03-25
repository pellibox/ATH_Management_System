
export const COURT_TYPES = {
  TENNIS_CLAY: "Tennis-Clay",
  TENNIS_HARD: "Tennis-Hard",
  PADEL: "Padel",
  PICKLEBALL: "Pickleball",
  TOUCH_TENNIS: "TouchTennis"
};

export const PERSON_TYPES = {
  PLAYER: "player",
  COACH: "coach",
};

export const ACTIVITY_TYPES = {
  MATCH: "activity-match",
  TRAINING: "activity-training",
  BASKET_DRILL: "activity-basket-drill",
  GAME: "activity-game",
  LESSON: "activity-lesson",
  FITNESS: "activity-fitness", // Make sure this exists
  OTHER: "activity-other"
};

export const DEFAULT_PROGRAMS = [
  { id: "program1", name: "Tennis Academy", color: "#3b82f6" },
  { id: "program2", name: "Padel Club", color: "#10b981" },
  { id: "program3", name: "Junior Development", color: "#f59e0b" },
  { id: "program4", name: "High Performance", color: "#ef4444" },
];

// Add the PROGRAM_COLORS constant
export const PROGRAM_COLORS = {
  RED: "#ef4444",
  ORANGE: "#f59e0b",
  GREEN: "#10b981",
  BLUE: "#3b82f6",
  PURPLE: "#8b5cf6",
  PINK: "#ec4899",
};
