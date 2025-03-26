
import { useProgramsState } from "@/contexts/programs/useProgramsState";
import { ProgramsHeader } from "@/components/programs/ProgramsHeader";
import { ProgramFilters } from "@/components/programs/ProgramFilters";
import { ProgramList } from "@/components/programs/ProgramList";
import { FilteredProgramsList } from "@/components/programs/FilteredProgramsList";
import { PROGRAM_CATEGORIES } from "@/contexts/programs/constants";

export default function Programs() {
  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    expandedProgram,
    filteredPrograms,
    toggleExpand,
    resetFilters
  } = useProgramsState();

  return (
    <div className="max-w-7xl mx-auto px-4 animate-fade-in">
      <ProgramsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <ProgramFilters 
        categories={PROGRAM_CATEGORIES} 
        activeFilter={filter} 
        setFilter={setFilter} 
      />
      
      {/* Category Headers for "all" view */}
      {filter === "all" ? (
        <ProgramList 
          expandedProgram={expandedProgram} 
          toggleExpand={toggleExpand} 
        />
      ) : (
        <FilteredProgramsList
          filter={filter}
          filteredPrograms={filteredPrograms}
          expandedProgram={expandedProgram}
          toggleExpand={toggleExpand}
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
}
