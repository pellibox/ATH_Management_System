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
  FITNESS: "activity-fitness", 
  MENTAL: "activity-mental",
  MEDICAL: "activity-medical",
  STRATEGY: "activity-strategy",
  TECHNIQUE: "activity-technique",
  BIOMECHANICS: "activity-biomechanics",
  OTHER: "activity-other"
};

export const DEFAULT_PROGRAMS = [
  { id: "program1", name: "Tennis Academy", color: "#3b82f6" },
  { id: "program2", name: "Padel Club", color: "#10b981" },
  { id: "program3", name: "Junior Development", color: "#f59e0b" },
  { id: "program4", name: "High Performance", color: "#ef4444" },
  // Performance Programs
  { id: "perf2", name: "Performance 2", color: "#8B4513", category: "performance" },
  { id: "perf3", name: "Performance 3", color: "#8B4513", category: "performance" },
  { id: "perf4", name: "Performance 4", color: "#8B4513", category: "performance" },
  { id: "elite", name: "Elite Performance", color: "#8B4513", category: "performance" },
  { id: "elite-full", name: "Elite Performance Full", color: "#8B4513", category: "performance" },
  // Junior Programs
  { id: "junior-sit", name: "SIT - Scuola Individuazione Talenti", color: "#2E8B57", category: "junior" },
  { id: "junior-sat", name: "SAT – Propedeutico", color: "#2E8B57", category: "junior" },
  // Personal Coaching
  { id: "personal-coaching", name: "Private Personal Coaching", color: "#4682B4", category: "personal" },
  { id: "lezioni-private", name: "Lezioni Private", color: "#4682B4", category: "personal" },
  // Adult Programs
  { id: "adult", name: "Adult Training", color: "#4682B4", category: "adult" },
  { id: "university", name: "Universitari / Scuole Online", color: "#4682B4", category: "adult" },
  // Coach Programs
  { id: "coach", name: "Coach / Allenatori", color: "#483D8B", category: "coach" },
];

// Add the PROGRAM_COLORS constant
export const PROGRAM_COLORS = {
  RED: "#ef4444",
  ORANGE: "#f59e0b",
  GREEN: "#10b981",
  BLUE: "#3b82f6",
  PURPLE: "#8b5cf6",
  PINK: "#ec4899",
  BROWN: "#8B4513",
  FOREST_GREEN: "#2E8B57",
  STEEL_BLUE: "#4682B4",
  SLATE_BLUE: "#483D8B",
  SIENNA: "#D2691E"
};

// Add detailed tennis programs data
export const TENNIS_PROGRAMS = {
  PERFORMANCE: [
    {
      id: "perf2",
      name: "Performance 2",
      color: "#8B4513",
      description: "2 giorni a settimana (40 settimane)",
      details: [
        "2 sessioni tennis da 1,5 ore (3 ore settimanali)",
        "2 sessioni atletica da 1,5 ore (3 ore settimanali)",
        "Massimo 3 atleti per campo"
      ],
      cost: "€4.000",
      weeklyHours: 6,
      totalWeeks: 40,
      vicki: true
    },
    {
      id: "perf3",
      name: "Performance 3",
      color: "#8B4513",
      description: "3 giorni a settimana (40 settimane)",
      details: [
        "3 sessioni tennis da 1,5 ore (4,5 ore settimanali)",
        "3 sessioni atletica da 1,5 ore (4,5 ore settimanali)",
        "Massimo 3 atleti per campo"
      ],
      cost: "€5.000",
      weeklyHours: 9,
      totalWeeks: 40,
      vicki: true
    },
    {
      id: "perf4",
      name: "Performance 4",
      color: "#8B4513",
      description: "4 giorni a settimana (40 settimane)",
      details: [
        "4 sessioni tennis da 1,5 ore (6 ore settimanali)",
        "4 sessioni atletica da 1,5 ore (6 ore settimanali)",
        "Massimo 2 atleti per campo"
      ],
      cost: "€6.500",
      weeklyHours: 12,
      totalWeeks: 40,
      vicki: true
    },
    {
      id: "elite",
      name: "Elite Performance",
      color: "#8B4513",
      description: "5 giorni a settimana (40 settimane)",
      details: [
        "5 sessioni tennis da 1,5 ore (7,5 ore settimanali)",
        "Massimo 2 atleti per campo"
      ],
      cost: "€7.500",
      weeklyHours: 7.5,
      totalWeeks: 40,
      vicki: true
    },
    {
      id: "elite-full",
      name: "Elite Performance Full",
      color: "#8B4513",
      description: "Programma completo (40 settimane)",
      details: [
        "5 sessioni tennis mattina + 5 pomeriggio (totale 20 ore settimanali)",
        "7 sessioni atletica da 1,5 ore (10,5 ore settimanali)",
        "Massimo 2 atleti per campo"
      ],
      cost: "€15.000",
      weeklyHours: 30.5,
      totalWeeks: 40,
      vicki: true
    }
  ],
  JUNIOR: [
    {
      id: "junior-sit",
      name: "SIT - Scuola Individuazione Talenti (4-10 anni)",
      color: "#2E8B57",
      description: "under 8–10 + over 10 (30 settimane)",
      details: [
        "1 sessione tennis da 1 ora a settimana",
        "2 sessioni atletica da 1 ora a settimana"
      ],
      cost: "€950",
      weeklyHours: 3,
      totalWeeks: 30,
      vicki: true
    },
    {
      id: "junior-sat",
      name: "SAT – Propedeutico",
      color: "#2E8B57",
      description: "under 4–6, sede di Rodano (30 settimane)",
      details: [
        "1 sessione tennis da 1 ora a settimana",
        "1 sessione atletica da 30 minuti"
      ],
      cost: "€500",
      weeklyHours: 1.5,
      totalWeeks: 30,
      vicki: "optional"
    }
  ],
  PERSONAL: [
    {
      id: "personal-coaching",
      name: "Private Personal Coaching (13+ anni)",
      color: "#4682B4",
      description: "Per atleti dai 13 anni in su (tutto l'anno)",
      details: [
        "Sessioni di 1,5 ore, una volta alla settimana",
        "Professional coach e sparring dedicato",
        "Analisi VICKI™ Elite o Advanced",
        "Report dettagliato post-sessione"
      ],
      cost: "€120",
      weeklyHours: 1.5,
      totalWeeks: 52,
      vicki: true
    },
    {
      id: "lezioni-private",
      name: "Lezioni Private",
      color: "#4682B4",
      description: "Frequenza su richiesta (tutto l'anno)",
      details: [
        "Lezioni individuali o in piccoli gruppi (max 2 allievi)",
        "Maestro certificato dedicato",
        "Analisi VICKI™ disponibile su richiesta",
        "Prezzo personalizzato in base alle esigenze"
      ],
      cost: "Prezzo personalizzato",
      weeklyHours: 1,
      totalWeeks: 52,
      vicki: "optional"
    }
  ],
  ADULT: [
    {
      id: "adult",
      name: "Adult Training",
      color: "#4682B4",
      description: "Per adulti (30 settimane)",
      details: [
        "1 sessione tennis da 1 ora a settimana",
        "Attività in gruppo (4 persone per campo)"
      ],
      cost: "€700",
      weeklyHours: 1,
      totalWeeks: 30,
      vicki: true
    },
    {
      id: "university",
      name: "Universitari / Scuole Online",
      color: "#4682B4",
      description: "Programma flessibile (30 settimane)",
      details: [
        "1 sessione a settimana da 1,5 ore (sessione di atletica opzionale)"
      ],
      cost: "€1.000",
      weeklyHours: 1.5,
      totalWeeks: 30,
      vicki: "optional"
    }
  ],
  COACH: [
    {
      id: "coach",
      name: "Coach / Allenatori",
      color: "#483D8B",
      description: "Formazione avanzata (tutto l'anno)",
      details: [
        "Accesso alla piattaforma di tracking e analisi video",
        "Integrazione con il sistema VICKI per analisi avanzata",
        "Creazione di un metodo personalizzato (codificabile nel sistema)",
        "Formazione continua e aggiornamento metodologico"
      ],
      cost: "Prezzo personalizzato",
      weeklyHours: null,
      totalWeeks: 52,
      vicki: true
    }
  ],
  PADEL: [
    {
      id: "padel-base",
      name: "Padel Base",
      color: "#D2691E",
      description: "Corso principianti (30 settimane)",
      details: [
        "1 sessione da 1 ora a settimana",
        "Gruppi di max 4 persone per campo"
      ],
      cost: "€600",
      weeklyHours: 1,
      totalWeeks: 30,
      vicki: "optional"
    }
  ]
};
