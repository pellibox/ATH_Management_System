
import { Button } from "@/components/ui/button";
import { usePlayerContext } from "@/contexts/PlayerContext";
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";

export const PlayerFilters = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    levelFilter, 
    setLevelFilter, 
    coachFilter, 
    setCoachFilter,
    programFilter,
    setProgramFilter,
    coaches, 
    resetFilters 
  } = usePlayerContext();

  // Extract all unique programs from TENNIS_PROGRAMS
  const allPrograms = [
    ...TENNIS_PROGRAMS.PERFORMANCE,
    ...TENNIS_PROGRAMS.JUNIOR,
    ...TENNIS_PROGRAMS.PERSONAL,
    ...TENNIS_PROGRAMS.ADULT,
    ...TENNIS_PROGRAMS.COACH,
    ...TENNIS_PROGRAMS.PADEL
  ];

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Cerca
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
              placeholder="Cerca nome, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
            Livello
          </label>
          <select
            id="level"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">Tutti i livelli</option>
            <option value="Beginner">Principiante</option>
            <option value="Intermediate">Intermedio</option>
            <option value="Advanced">Avanzato</option>
            <option value="Professional">Professionista</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="coach" className="block text-sm font-medium text-gray-700 mb-1">
            Coach
          </label>
          <select
            id="coach"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
            value={coachFilter}
            onChange={(e) => setCoachFilter(e.target.value)}
          >
            <option value="all">Tutti i coach</option>
            {coaches.map((coach) => (
              <option key={coach} value={coach}>
                {coach}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
            Programma
          </label>
          <select
            id="program"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ath-blue/20"
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
          >
            <option value="all">Tutti i programmi</option>
            {allPrograms.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {(searchQuery || levelFilter !== "all" || coachFilter !== "all" || programFilter !== "all") && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetFilters}
          >
            Cancella filtri
          </Button>
        </div>
      )}
    </div>
  );
};
