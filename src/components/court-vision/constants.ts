
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
  BROWN: "#8B4513", // Brown
};

export const DEFAULT_PROGRAMS = [
  // Performance Programs
  { 
    id: "perf2", 
    name: "Performance 2", 
    color: "#8B4513", 
    cost: "€4.000",
    description: "2 giorni a settimana (40 settimane)",
    details: [
      "2 sessioni tennis da 1,5 ore (3 ore settimanali)",
      "2 sessioni atletica da 1,5 ore (3 ore settimanali)",
      "Massimo 3 atleti per campo"
    ],
    weeklyHours: 6,
    totalWeeks: 40
  },
  { 
    id: "perf3", 
    name: "Performance 3", 
    color: "#A52A2A", 
    cost: "€5.000",
    description: "3 giorni a settimana (40 settimane)",
    details: [
      "3 sessioni tennis da 1,5 ore (4,5 ore settimanali)",
      "3 sessioni atletica da 1,5 ore (4,5 ore settimanali)",
      "Massimo 3 atleti per campo"
    ],
    weeklyHours: 9,
    totalWeeks: 40
  },
  { 
    id: "perf4", 
    name: "Performance 4", 
    color: "#B22222", 
    cost: "€6.500",
    description: "4 giorni a settimana (40 settimane)",
    details: [
      "4 sessioni tennis da 1,5 ore (6 ore settimanali)",
      "4 sessioni atletica da 1,5 ore (6 ore settimanali)",
      "Massimo 2 atleti per campo"
    ],
    weeklyHours: 12,
    totalWeeks: 40
  },
  { 
    id: "elite", 
    name: "Elite Performance", 
    color: "#800000", 
    cost: "€7.500",
    description: "5 giorni a settimana (40 settimane)",
    details: [
      "5 sessioni tennis da 1,5 ore (7,5 ore settimanali)",
      "Massimo 2 atleti per campo"
    ],
    weeklyHours: 7.5,
    totalWeeks: 40
  },
  { 
    id: "elite-full", 
    name: "Elite Performance Full", 
    color: "#8B0000", 
    cost: "€15.000",
    description: "Programma completo (40 settimane)",
    details: [
      "5 sessioni tennis mattina + 5 pomeriggio (totale 20 ore settimanali)",
      "7 sessioni atletica da 1,5 ore (10,5 ore settimanali)",
      "Massimo 2 atleti per campo"
    ],
    weeklyHours: 30.5,
    totalWeeks: 40
  },
  
  // Junior Programs
  { 
    id: "junior-sit", 
    name: "Junior SIT", 
    color: "#2E8B57", 
    cost: "€950",
    description: "Scuola Individuazione Talenti (4-10 anni)",
    details: [
      "1 sessione tennis da 1 ora a settimana",
      "2 sessioni atletica da 1 ora a settimana"
    ],
    weeklyHours: 3,
    totalWeeks: 30
  },
  { 
    id: "junior-sat", 
    name: "Junior SAT", 
    color: "#3CB371", 
    cost: "€500",
    description: "Propedeutico under 4-6",
    details: [
      "1 sessione tennis da 1 ora a settimana",
      "1 sessione atletica da 30 minuti"
    ],
    weeklyHours: 1.5,
    totalWeeks: 30
  },
  
  // Personal Coaching
  { 
    id: "personal-coaching", 
    name: "Personal Coaching", 
    color: "#4682B4", 
    cost: "€120/ora",
    description: "Private Personal Coaching (13+ anni)",
    details: [
      "Sessioni di 1,5 ore, una volta alla settimana",
      "Professional coach e sparring dedicato",
      "Analisi VICKI™ Elite o Advanced",
      "Report dettagliato post-sessione"
    ],
    weeklyHours: 1.5,
    totalWeeks: 52
  },
  { 
    id: "lezioni-private", 
    name: "Lezioni Private", 
    color: "#6495ED", 
    cost: "Personalizzato",
    description: "Frequenza su richiesta (tutto l'anno)",
    details: [
      "Lezioni individuali o in piccoli gruppi (max 2 allievi)",
      "Maestro certificato dedicato",
      "Analisi VICKI™ disponibile su richiesta",
      "Prezzo personalizzato in base alle esigenze"
    ],
    weeklyHours: 1,
    totalWeeks: 52
  },
  
  // Adult Programs
  { 
    id: "adult", 
    name: "Adult Training", 
    color: "#4682B4", 
    cost: "€700",
    description: "Per adulti (30 settimane)",
    details: [
      "1 sessione tennis da 1 ora a settimana",
      "Attività in gruppo (4 persone per campo)"
    ],
    weeklyHours: 1,
    totalWeeks: 30
  },
  { 
    id: "university", 
    name: "Universitari", 
    color: "#4169E1", 
    cost: "€1.000",
    description: "Programma flessibile (30 settimane)",
    details: [
      "1 sessione a settimana da 1,5 ore (sessione di atletica opzionale)"
    ],
    weeklyHours: 1.5,
    totalWeeks: 30
  },
  
  // Coach Programs
  { 
    id: "coach", 
    name: "Coach / Allenatori", 
    color: "#483D8B", 
    cost: "Personalizzato",
    description: "Formazione e strumenti avanzati per allenatori di tennis",
    details: [
      "Disponibili tutto l'anno con prezzi personalizzati"
    ],
    weeklyHours: 0,
    totalWeeks: 52
  },
];
