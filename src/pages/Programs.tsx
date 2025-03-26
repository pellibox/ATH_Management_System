
import { useProgramsState } from "@/contexts/programs/useProgramsState";
import { ProgramsHeader } from "@/components/programs/ProgramsHeader";
import { ProgramFilters } from "@/components/programs/ProgramFilters";
import { ProgramList } from "@/components/programs/ProgramList";
import { FilteredProgramsList } from "@/components/programs/FilteredProgramsList";
import { useToast } from "@/hooks/use-toast";

export default function Programs() {
  const { toast } = useToast();
  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    expandedProgram,
    filteredPrograms,
    toggleExpand,
    resetFilters,
    updateProgram
  } = useProgramsState();

  const handleUpdateProgram = (updatedProgram) => {
    updateProgram(updatedProgram);
    toast({
      title: "Programma aggiornato",
      description: `Le modifiche a "${updatedProgram.name}" sono state salvate con successo.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 animate-fade-in">
      <ProgramsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <ProgramFilters 
        activeFilter={filter} 
        setFilter={setFilter} 
      />
      
      {/* Category Headers for "all" view */}
      {filter === "all" ? (
        <ProgramList 
          expandedProgram={expandedProgram} 
          toggleExpand={toggleExpand}
          onUpdateProgram={handleUpdateProgram}
        />
      ) : (
        <FilteredProgramsList
          filter={filter}
          filteredPrograms={filteredPrograms}
          expandedProgram={expandedProgram}
          toggleExpand={toggleExpand}
          resetFilters={resetFilters}
          onUpdateProgram={handleUpdateProgram}
        />
      )}
    </div>
  );
}
