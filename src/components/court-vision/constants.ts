// Court types
export const COURT_TYPES = {
  TENNIS_CLAY: "tennis-clay",
  TENNIS_HARD: "tennis-hard",
  PADEL: "padel",
  PICKLEBALL: "pickleball",
  TOUCH_TENNIS: "touch-tennis",
};

// Person types
export const PERSON_TYPES = {
  PLAYER: "player",
  COACH: "coach",
};

// Activity types
export const ACTIVITY_TYPES = {
  MATCH: "match",
  TRAINING: "training",
  BASKET_DRILL: "basket-drill",
  GAME: "game",
  LESSON: "lesson",
  OTHER: "other", // Added OTHER activity type
};

export const PROGRAM_COLORS = {
  RED: "#8B5CF6", // Vivid Purple
  BLUE: "#0EA5E9", // Ocean Blue
  GREEN: "#10B981", // Emerald
  ORANGE: "#F97316", // Bright Orange
  PURPLE: "#8B5CF6", // Vivid Purple
  PINK: "#D946EF", // Magenta Pink
  TEAL: "#14B8A6", // Teal
  YELLOW: "#EAB308", // Yellow
  GRAY: "#8E9196", // Neutral Gray
};

export const DEFAULT_PROGRAMS = [
  { id: "program-1", name: "Junior Development", color: PROGRAM_COLORS.RED },
  { id: "program-2", name: "Adult Beginners", color: PROGRAM_COLORS.BLUE },
  { id: "program-3", name: "Competition Team", color: PROGRAM_COLORS.GREEN },
  { id: "program-4", name: "Senior Group", color: PROGRAM_COLORS.ORANGE },
];
