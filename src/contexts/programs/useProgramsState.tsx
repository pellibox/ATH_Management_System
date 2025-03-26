
import { useState, useEffect } from "react";
import { TENNIS_PROGRAMS } from "@/components/court-vision/constants";
import { ProgramDetail } from "@/components/programs/types";
import { getCategoryFromId } from "./utils";
import { PROGRAM_CATEGORIES } from "./constants";

// Programs to exclude
const EXCLUDED_PROGRAMS = [
  "tennis-academy", 
  "padel-club", 
  "junior-development", 
  "high-performance"
];

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
    
    // Filter out excluded programs
    const filteredPrograms = programs.filter(program => 
      !EXCLUDED_PROGRAMS.includes(program.id)
    );
    
    // Add default values for enrollmentOpen if not present
    // And enhance color coding based on program selection status
    const programsWithDefaults = filteredPrograms.map(program => ({
      ...program,
      enrollmentOpen: program.enrollmentOpen !== false ? true : false,
      nextStart: program.nextStart || "Settembre 2024",
      // Enhance colors based on selection status
      color: program.enrollmentOpen ? 
        enhanceColor(program.color, 20) : // Brighter for open enrollment
        desaturateColor(program.color, 30) // Desaturated for closed enrollment
    }));
    
    // Populate PROGRAM_CATEGORIES.X.programs with filtered programs
    Object.keys(PROGRAM_CATEGORIES).forEach(key => {
      PROGRAM_CATEGORIES[key].programs = (TENNIS_PROGRAMS[key] || [])
        .filter(program => !EXCLUDED_PROGRAMS.includes(program.id));
    });
    
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
    // Apply color coding based on enrollment status
    const enhancedProgram = {
      ...updatedProgram,
      color: updatedProgram.enrollmentOpen ? 
        enhanceColor(updatedProgram.color, 20) : 
        desaturateColor(updatedProgram.color, 30)
    };
    
    // Update in allPrograms
    const updatedAllPrograms = allPrograms.map(program => 
      program.id === enhancedProgram.id ? enhancedProgram : program
    );
    
    setAllPrograms(updatedAllPrograms);
    
    // Also update in TENNIS_PROGRAMS for persistence
    // Find which category the program belongs to
    const category = getCategoryFromId(enhancedProgram.id);
    if (category && TENNIS_PROGRAMS[category.toUpperCase()]) {
      const categoryPrograms = TENNIS_PROGRAMS[category.toUpperCase()];
      const programIndex = categoryPrograms.findIndex(p => p.id === enhancedProgram.id);
      
      if (programIndex !== -1) {
        categoryPrograms[programIndex] = enhancedProgram;
        
        // Also update in PROGRAM_CATEGORIES
        if (PROGRAM_CATEGORIES[category.toUpperCase()] && 
            PROGRAM_CATEGORIES[category.toUpperCase()].programs) {
          const catProgIndex = PROGRAM_CATEGORIES[category.toUpperCase()].programs.findIndex(
            p => p.id === enhancedProgram.id
          );
          if (catProgIndex !== -1) {
            PROGRAM_CATEGORIES[category.toUpperCase()].programs[catProgIndex] = enhancedProgram;
          }
        }
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

// Helper function to enhance color brightness
function enhanceColor(hexColor: string, percent: number): string {
  // Convert hex to RGB
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);
  
  // Increase brightness
  r = Math.min(255, r + Math.round(r * percent / 100));
  g = Math.min(255, g + Math.round(g * percent / 100));
  b = Math.min(255, b + Math.round(b * percent / 100));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Helper function to desaturate color
function desaturateColor(hexColor: string, percent: number): string {
  // Convert hex to RGB
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);
  
  // Calculate greyscale value
  const grey = 0.3 * r + 0.59 * g + 0.11 * b;
  
  // Mix original with grey based on percent
  r = Math.round(r + (grey - r) * (percent / 100));
  g = Math.round(g + (grey - g) * (percent / 100));
  b = Math.round(b + (grey - b) * (percent / 100));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
