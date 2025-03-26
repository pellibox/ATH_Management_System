
import { useState, useEffect } from "react";
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";
import { ProgramDetail } from "@/components/programs/ProgramCard";
import { getCategoryFromId } from "./utils";

export function useProgramsState() {
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
    
    // Add default values for enrollmentOpen if not present
    const programsWithDefaults = programs.map(program => ({
      ...program,
      enrollmentOpen: program.enrollmentOpen !== false ? true : false,
      nextStart: program.nextStart || "Settembre 2024"
    }));
    
    setAllPrograms(programsWithDefaults);
    setFilteredPrograms(programsWithDefaults);
  }, []);
  
  // Filter programs when filter or search changes
  useEffect(() => {
    let filtered = [...allPrograms];
    
    // Apply category filter
    if (filter !== "all") {
      filtered = filtered.filter(program => {
        // Get category from ID mapping
        const category = getCategoryFromId(program.id);
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

  // Reset filters
  const resetFilters = () => {
    setFilter("all");
    setSearchQuery("");
  };
  
  // Update program
  const updateProgram = (updatedProgram: ProgramDetail) => {
    // Update in allPrograms
    const updatedAllPrograms = allPrograms.map(program => 
      program.id === updatedProgram.id ? updatedProgram : program
    );
    
    setAllPrograms(updatedAllPrograms);
    
    // Also update in TENNIS_PROGRAMS for persistence
    // Find which category the program belongs to
    const category = getCategoryFromId(updatedProgram.id);
    if (category && TENNIS_PROGRAMS[category.toUpperCase()]) {
      const categoryPrograms = TENNIS_PROGRAMS[category.toUpperCase()];
      const programIndex = categoryPrograms.findIndex(p => p.id === updatedProgram.id);
      
      if (programIndex !== -1) {
        categoryPrograms[programIndex] = updatedProgram;
      }
    }
  };
  
  return {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    expandedProgram,
    allPrograms,
    filteredPrograms,
    toggleExpand,
    resetFilters,
    updateProgram
  };
}
