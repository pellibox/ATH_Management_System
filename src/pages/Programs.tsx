import { useState } from "react";
import { Calendar, Plus, Search, Users, Clock, BookOpen, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_PROGRAMS } from "@/components/court-vision/constants";

// Extend DEFAULT_PROGRAMS with the missing properties for our display
const enhancedPrograms = DEFAULT_PROGRAMS.map(program => ({
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
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Programmi</h1>
          <p className="text-gray-600 mt-1">Gestisci i programmi di allenamento e i corsi</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Cerca programmi..."
              className="h-10 w-64 rounded-lg bg-white shadow-sm pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ath-blue text-white hover:bg-ath-blue-dark transition-colors">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Nuovo Programma</span>
          </button>
        </div>
      </div>
      
      {/* Filter */}
      <div className="mb-6 bg-white shadow-sm rounded-lg p-1 inline-flex items-center overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === "all"
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Tutti i Programmi
        </button>
        <button
          onClick={() => setFilter(PROGRAM_CATEGORIES.PERFORMANCE)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === PROGRAM_CATEGORIES.PERFORMANCE
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Agonisti Performance
        </button>
        <button
          onClick={() => setFilter(PROGRAM_CATEGORIES.JUNIOR)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === PROGRAM_CATEGORIES.JUNIOR
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Junior
        </button>
        <button
          onClick={() => setFilter(PROGRAM_CATEGORIES.PERSONAL)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === PROGRAM_CATEGORIES.PERSONAL
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Personal Coaching
        </button>
        <button
          onClick={() => setFilter(PROGRAM_CATEGORIES.ADULT)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === PROGRAM_CATEGORIES.ADULT
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Adulti e Universitari
        </button>
        <button
          onClick={() => setFilter(PROGRAM_CATEGORIES.COACH)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
            filter === PROGRAM_CATEGORIES.COACH
              ? "bg-ath-blue-light text-ath-blue"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Coach
        </button>
      </div>
      
      {/* Category Headers */}
      {filter === "all" && (
        <div className="space-y-8">
          {/* Performance Section */}
          <div>
            <h2 className="text-2xl font-bold border-l-4 border-[#8B4513] pl-3 mb-4">
              Agonisti Performance ed Elite
            </h2>
            <p className="text-gray-600 mb-6">
              Percorsi ad alto contenuto tecnico e fisico, pensati per chi compete a livello FITP, Tennis Europe o ITF. 
              Programmi di 48 settimane per un percorso verso il proprio massimo potenziale.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {DEFAULT_PROGRAMS
                .filter(program => programCategoryMap[program.id] === PROGRAM_CATEGORIES.PERFORMANCE)
                .map(renderProgramCard)}
            </div>
          </div>
          
          {/* Junior Section */}
          <div>
            <h2 className="text-2xl font-bold border-l-4 border-[#2E8B57] pl-3 mb-4">
              Junior Program
            </h2>
            <p className="text-gray-600 mb-6">
              Percorsi dedicati allo sviluppo motorio e tecnico dai 4 ai 12 anni. Programmi di 30 settimane.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {DEFAULT_PROGRAMS
                .filter(program => programCategoryMap[program.id] === PROGRAM_CATEGORIES.JUNIOR)
                .map(renderProgramCard)}
            </div>
          </div>
          
          {/* Personal Coaching Section */}
          <div>
            <h2 className="text-2xl font-bold border-l-4 border-[#4682B4] pl-3 mb-4">
              Personal Coaching e Lezioni Private
            </h2>
            <p className="text-gray-600 mb-6">
              Il Personal Coaching include maestro e sparring dedicati con analisi VICKI™, mentre le Lezioni Private 
              offrono sessioni personalizzate con un maestro certificato. Entrambi i programmi disponibili su prenotazione.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {DEFAULT_PROGRAMS
                .filter(program => programCategoryMap[program.id] === PROGRAM_CATEGORIES.PERSONAL)
                .map(renderProgramCard)}
            </div>
          </div>
          
          {/* Adult Section */}
          <div>
            <h2 className="text-2xl font-bold border-l-4 border-[#4682B4] pl-3 mb-4">
              Adulti e Universitari
            </h2>
            <p className="text-gray-600 mb-6">
              Programmi per adulti e studenti con esigenze di flessibilità. Programmi di 30 settimane.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {DEFAULT_PROGRAMS
                .filter(program => programCategoryMap[program.id] === PROGRAM_CATEGORIES.ADULT)
                .map(renderProgramCard)}
            </div>
          </div>
          
          {/* Coach Section */}
          <div>
            <h2 className="text-2xl font-bold border-l-4 border-[#483D8B] pl-3 mb-4">
              Programmi per Coach
            </h2>
            <p className="text-gray-600 mb-6">
              Formazione e strumenti avanzati per allenatori di tennis. Disponibili tutto l'anno con prezzi personalizzati.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {DEFAULT_PROGRAMS
                .filter(program => programCategoryMap[program.id] === PROGRAM_CATEGORIES.COACH)
                .map(renderProgramCard)}
            </div>
          </div>
        </div>
      )}
      
      {/* Filtered Results */}
      {filter !== "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map(renderProgramCard)}
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
  
  function renderProgramCard(program) {
    return (
      <div 
        key={program.id} 
        className={cn(
          "bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-300",
          expandedProgram === program.id ? "ring-2 ring-ath-blue/20" : "",
          "card-hover"
        )}
      >
        <div 
          className="p-6 cursor-pointer"
          onClick={() => toggleExpand(program.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{program.name}</h3>
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: program.color }}
                ></span>
              </div>
              <p className="text-gray-600 mt-1">{program.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-lg font-semibold text-ath-blue">{program.cost}</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-6">
            {program.weeklyHours > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {program.weeklyHours} ore/settimana
                </span>
              </div>
            )}
            {program.totalWeeks > 0 && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{program.totalWeeks} settimane</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "mt-2 flex justify-end items-center gap-1",
            "text-ath-blue transition-transform duration-300",
            expandedProgram === program.id ? "rotate-180" : ""
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
        
        {/* Expanded details */}
        {expandedProgram === program.id && (
          <div className="px-6 pb-6 pt-0 border-t-0 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Dettagli Programma</h4>
                <ul className="space-y-2">
                  {program.details && program.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-ath-blue mr-2">•</span> 
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
                
                {program.weeklyHours > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Monte Ore</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ore settimanali:</span>
                        <span className="text-sm font-medium">{program.weeklyHours} ore</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Settimane totali:</span>
                        <span className="text-sm font-medium">{program.totalWeeks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Monte ore totale:</span>
                        <span className="text-sm font-medium">{program.weeklyHours * program.totalWeeks} ore</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Informazioni</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Costo:</span>
                    <span className="text-sm font-medium">{program.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Iscrizioni:</span>
                    <span className="text-sm">Aperte</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Integrazione VICKI™:</span>
                    <span className="text-sm">Disponibile</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Prossimo inizio:</span>
                    <span className="text-sm">Settembre 2024</span>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3 justify-end">
                  <button className="px-3 py-1.5 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors">
                    Dettagli
                  </button>
                  <button className="px-3 py-1.5 rounded bg-ath-blue text-white text-sm hover:bg-ath-blue-dark transition-colors">
                    Modifica
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
