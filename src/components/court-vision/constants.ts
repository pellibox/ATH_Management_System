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
  { id: "perf2", name: "Performance 2", color: "#8B4513", cost: "€4.000" },
  { id: "perf3", name: "Performance 3", color: "#A52A2A", cost: "€5.000" },
  { id: "perf4", name: "Performance 4", color: "#B22222", cost: "€6.500" },
  { id: "elite", name: "Elite Performance", color: "#800000", cost: "€7.500" },
  { id: "elite-full", name: "Elite Performance Full", color: "#8B0000", cost: "€15.000" },
  { id: "junior-sit", name: "Junior SIT", color: "#2E8B57", cost: "€950" },
  { id: "junior-sat", name: "Junior SAT", color: "#3CB371", cost: "€500" },
  { id: "adult", name: "Adult Training", color: "#4682B4", cost: "€700" },
  { id: "university", name: "Universitari", color: "#4169E1", cost: "€1.000" },
  { id: "coach", name: "Coach / Allenatori", color: "#483D8B", cost: "" },
];
