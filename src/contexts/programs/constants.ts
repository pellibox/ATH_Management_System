
// Program categories for filtering
export const PROGRAM_CATEGORIES = {
  PERFORMANCE: "performance",
  JUNIOR: "junior",
  PERSONAL: "personal",
  ADULT: "adult",
  COACH: "coach",
  PADEL: "padel"
};

// Category section descriptions
export const CATEGORY_DESCRIPTIONS = {
  PERFORMANCE: "Percorsi ad alto contenuto tecnico e fisico, pensati per chi compete a livello FITP, Tennis Europe o ITF. Programmi di 48 settimane per un percorso verso il proprio massimo potenziale.",
  JUNIOR: "Percorsi dedicati allo sviluppo motorio e tecnico dai 4 ai 12 anni. Programmi di 30 settimane.",
  PERSONAL: "Il Personal Coaching include maestro e sparring dedicati con analisi VICKI™, mentre le Lezioni Private offrono sessioni personalizzate con un maestro certificato. Entrambi i programmi disponibili su prenotazione.",
  ADULT: "Programmi per adulti e studenti con esigenze di flessibilità. Programmi di 30 settimane.",
  COACH: "Formazione e strumenti avanzati per allenatori di tennis. Disponibili tutto l'anno con prezzi personalizzati.",
  PADEL: "Programmi dedicati al Padel per tutti i livelli. Corsi per principianti, intermedi e avanzati."
};

// Category border colors
export const CATEGORY_COLORS = {
  PERFORMANCE: "#8B4513",
  JUNIOR: "#2E8B57",
  PERSONAL: "#4682B4",
  ADULT: "#4682B4",
  COACH: "#483D8B",
  PADEL: "#D2691E"
};

// Helper to get human-readable category titles
export function getCategoryTitle(category: string): string {
  const titles = {
    PERFORMANCE: "Agonisti Performance ed Elite",
    JUNIOR: "Junior Program",
    PERSONAL: "Personal Coaching e Lezioni Private",
    ADULT: "Adulti e Universitari",
    COACH: "Programmi per Coach",
    PADEL: "Programmi Padel"
  };
  
  return titles[category] || category;
}
