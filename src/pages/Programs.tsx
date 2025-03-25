
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DEFAULT_PROGRAMS } from "@/components/court-vision/constants";
import { ProgramsHeader } from "@/components/programs/ProgramsHeader";
import { ProgramFilters } from "@/components/programs/ProgramFilters";
import { ProgramCategorySection } from "@/components/programs/ProgramCategorySection";
import { ProgramDetail } from "@/components/programs/ProgramCard";

// Extend DEFAULT_PROGRAMS with the missing properties for our display
const enhancedPrograms: ProgramDetail[] = DEFAULT_PROGRAMS.map(program => ({
  ...program,
  description: `Description for ${program.name}`,
  details: [`Detail 1 for ${program.name}`, `Detail 2 for ${program.name}`],
  cost: `€${Math.floor(Math.random() * 1000) + 500}`,
  weeklyHours: Math.floor(Math.random() * 10) + 2,
  totalWeeks: Math.floor(Math.random() * 20) + 10
}));

// Define program categories for filtering
const PROGRAM_CATEGORIES = {
  PERFORMANCE: "performance",
  JUNIOR: "junior",
  PERSONAL: "personal",
  ADULT: "adult",
  COACH: "coach",
  PADEL: "padel"
};

// Map our programs to categories
const programCategoryMap = {
  "program1": PROGRAM_CATEGORIES.PERFORMANCE,
  "program2": PROGRAM_CATEGORIES.PADEL,
  "program3": PROGRAM_CATEGORIES.JUNIOR,
  "program4": PROGRAM_CATEGORIES.PERFORMANCE,
  "perf2": PROGRAM_CATEGORIES.PERFORMANCE,
  "perf3": PROGRAM_CATEGORIES.PERFORMANCE,
  "perf4": PROGRAM_CATEGORIES.PERFORMANCE,
  "elite": PROGRAM_CATEGORIES.PERFORMANCE,
  "elite-full": PROGRAM_CATEGORIES.PERFORMANCE,
  "junior-sit": PROGRAM_CATEGORIES.JUNIOR,
  "junior-sat": PROGRAM_CATEGORIES.JUNIOR,
  "personal-coaching": PROGRAM_CATEGORIES.PERSONAL,
  "lezioni-private": PROGRAM_CATEGORIES.PERSONAL,
  "adult": PROGRAM_CATEGORIES.ADULT,
  "university": PROGRAM_CATEGORIES.ADULT,
  "coach": PROGRAM_CATEGORIES.COACH
};

// Category section descriptions
const CATEGORY_DESCRIPTIONS = {
  PERFORMANCE: "Percorsi ad alto contenuto tecnico e fisico, pensati per chi compete a livello FITP, Tennis Europe o ITF. Programmi di 48 settimane per un percorso verso il proprio massimo potenziale.",
  JUNIOR: "Percorsi dedicati allo sviluppo motorio e tecnico dai 4 ai 12 anni. Programmi di 30 settimane.",
  PERSONAL: "Il Personal Coaching include maestro e sparring dedicati con analisi VICKI™, mentre le Lezioni Private offrono sessioni personalizzate con un maestro certificato. Entrambi i programmi disponibili su prenotazione.",
  ADULT: "Programmi per adulti e studenti con esigenze di flessibilità. Programmi di 30 settimane.",
  COACH: "Formazione e strumenti avanzati per allenatori di tennis. Disponibili tutto l'anno con prezzi personalizzati.",
  PADEL: "Programmi dedicati al Padel per tutti i livelli. Corsi per principianti, intermedi e avanzati."
};

// Category border colors
const CATEGORY_COLORS = {
  PERFORMANCE: "#8B4513",
  JUNIOR: "#2E8B57",
  PERSONAL: "#4682B4",
  ADULT: "#4682B4",
  COACH: "#483D8B",
  PADEL: "#D2691E"
};

export default function Programs() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  
  // Filter programs based on category and search query
  const filteredPrograms = enhancedPrograms
    .filter(program => {
      if (filter === "all") return true;
      return programCategoryMap[program.id] === filter;
    })
    .filter(program => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        program.name.toLowerCase().includes(query) ||
        program.description?.toLowerCase().includes(query) ||
        program.details?.some(detail => detail.toLowerCase().includes(query))
      );
    });
  
  // Toggle program card expansion
  const toggleExpand = (id: string) => {
    if (expandedProgram === id) {
      setExpandedProgram(null);
    } else {
      setExpandedProgram(id);
    }
  };

  // Group programs by category
  const programsByCategory = Object.entries(PROGRAM_CATEGORIES).reduce((acc, [category, value]) => {
    acc[category] = enhancedPrograms.filter(program => programCategoryMap[program.id] === value);
    return acc;
  }, {} as Record<string, ProgramDetail[]>);
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <ProgramsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <ProgramFilters 
        categories={PROGRAM_CATEGORIES} 
        activeFilter={filter} 
        setFilter={setFilter} 
      />
      
      {/* Category Headers for "all" view */}
      {filter === "all" && (
        <div className="space-y-8">
          {/* Dynamic Category Sections */}
          {Object.entries(PROGRAM_CATEGORIES).map(([category]) => (
            <ProgramCategorySection
              key={category}
              title={getCategoryTitle(category)}
              description={CATEGORY_DESCRIPTIONS[category] || ""}
              borderColor={CATEGORY_COLORS[category] || "#000"}
              programs={programsByCategory[category] || []}
              expandedProgram={expandedProgram}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
      
      {/* Filtered Results */}
      {filter !== "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map(program => (
            <ProgramCategorySection
              key={program.id}
              title=""
              description=""
              borderColor=""
              programs={[program]}
              expandedProgram={expandedProgram}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
      
      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Nessun programma corrisponde alla tua ricerca</p>
          <button 
            onClick={() => {
              setFilter("all");
              setSearchQuery("");
            }}
            className="mt-2 text-ath-blue hover:text-ath-blue-dark"
          >
            Visualizza tutti i programmi
          </button>
        </div>
      )}
    </div>
  );
}

// Helper to get human-readable category titles
function getCategoryTitle(category: string): string {
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
