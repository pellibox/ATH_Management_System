import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";
import { ProgramsHeader } from "@/components/programs/ProgramsHeader";
import { ProgramFilters } from "@/components/programs/ProgramFilters";
import { ProgramCategorySection } from "@/components/programs/ProgramCategorySection";
import { ProgramDetail, ProgramCard } from "@/components/programs/ProgramCard";

// Define program categories for filtering
const PROGRAM_CATEGORIES = {
  PERFORMANCE: "performance",
  JUNIOR: "junior",
  PERSONAL: "personal",
  ADULT: "adult",
  COACH: "coach",
  PADEL: "padel"
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
  const [allPrograms, setAllPrograms] = useState<ProgramDetail[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<ProgramDetail[]>([]);
  
  // Initialize all programs
  useEffect(() => {
    // Combine all program categories into a single array
    const programs: ProgramDetail[] = [
      ...TENNIS_PROGRAMS.PERFORMANCE,
      ...TENNIS_PROGRAMS.JUNIOR,
      ...TENNIS_PROGRAMS.PERSONAL, 
      ...TENNIS_PROGRAMS.ADULT,
      ...TENNIS_PROGRAMS.COACH,
      ...TENNIS_PROGRAMS.PADEL
    ];
    
    setAllPrograms(programs);
    setFilteredPrograms(programs);
  }, []);
  
  // Filter programs when filter or search changes
  useEffect(() => {
    let filtered = [...allPrograms];
    
    // Apply category filter
    if (filter !== "all") {
      filtered = filtered.filter(program => {
        // Get category from ID mapping
        let category = null;
        
        if (program.id.includes("perf") || program.id.includes("elite")) {
          category = PROGRAM_CATEGORIES.PERFORMANCE;
        } else if (program.id.includes("junior") || program.id.includes("sat") || program.id.includes("sit")) {
          category = PROGRAM_CATEGORIES.JUNIOR;
        } else if (program.id.includes("personal") || program.id.includes("lezioni")) {
          category = PROGRAM_CATEGORIES.PERSONAL;
        } else if (program.id.includes("adult") || program.id.includes("university")) {
          category = PROGRAM_CATEGORIES.ADULT;
        } else if (program.id.includes("coach") || program.id.includes("club")) {
          category = PROGRAM_CATEGORIES.COACH;
        } else if (program.id.includes("padel")) {
          category = PROGRAM_CATEGORIES.PADEL;
        }
        
        return category === filter;
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(program => {
        return (
          program.name.toLowerCase().includes(query) ||
          program.description?.toLowerCase().includes(query) ||
          program.details?.some(detail => detail.toLowerCase().includes(query))
        );
      });
    }
    
    setFilteredPrograms(filtered);
  }, [filter, searchQuery, allPrograms]);
  
  // Toggle program card expansion
  const toggleExpand = (id: string) => {
    if (expandedProgram === id) {
      setExpandedProgram(null);
    } else {
      setExpandedProgram(id);
    }
  };

  // Get programs for a specific category
  const getProgramsByCategory = (category: string) => {
    switch(category) {
      case PROGRAM_CATEGORIES.PERFORMANCE:
        return TENNIS_PROGRAMS.PERFORMANCE;
      case PROGRAM_CATEGORIES.JUNIOR:
        return TENNIS_PROGRAMS.JUNIOR;
      case PROGRAM_CATEGORIES.PERSONAL:
        return TENNIS_PROGRAMS.PERSONAL;
      case PROGRAM_CATEGORIES.ADULT:
        return TENNIS_PROGRAMS.ADULT;
      case PROGRAM_CATEGORIES.COACH:
        return TENNIS_PROGRAMS.COACH;
      case PROGRAM_CATEGORIES.PADEL:
        return TENNIS_PROGRAMS.PADEL;
      default:
        return [];
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 animate-fade-in">
      <ProgramsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <ProgramFilters 
        categories={PROGRAM_CATEGORIES} 
        activeFilter={filter} 
        setFilter={setFilter} 
      />
      
      {/* Category Headers for "all" view */}
      {filter === "all" && (
        <div className="space-y-6">
          {/* Dynamic Category Sections */}
          {Object.entries(PROGRAM_CATEGORIES).map(([category, value]) => (
            <ProgramCategorySection
              key={category}
              title={getCategoryTitle(category)}
              description={CATEGORY_DESCRIPTIONS[category] || ""}
              borderColor={CATEGORY_COLORS[category] || "#000"}
              programs={getProgramsByCategory(value)}
              expandedProgram={expandedProgram}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
      
      {/* Filtered Results */}
      {filter !== "all" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {getCategoryTitle(Object.keys(PROGRAM_CATEGORIES).find(key => 
              PROGRAM_CATEGORIES[key] === filter
            ) || "")}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {CATEGORY_DESCRIPTIONS[Object.keys(PROGRAM_CATEGORIES).find(key => 
              PROGRAM_CATEGORIES[key] === filter
            ) || ""]}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredPrograms.map(program => (
              <ProgramCard
                key={program.id}
                program={program}
                expandedProgram={expandedProgram}
                toggleExpand={toggleExpand}
              />
            ))}
          </div>
        </div>
      )}
      
      {filteredPrograms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Nessun programma corrisponde alla tua ricerca</p>
          <button 
            onClick={() => {
              setFilter("all");
              setSearchQuery("");
            }}
            className="mt-2 text-xs text-ath-blue hover:text-ath-blue-dark"
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
